import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';
import { UserEntity } from '../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionEntity } from '../database/entity/direction.entity';
import { ConfigService } from '../config/config.service';
import { IIssue, IProject, IUser } from './youtrack.interface';
import { set, merge, get, isNil } from 'lodash';
import { ProjectEntity } from '../database/entity/project.entity';
import { ItemEntity } from '../database/entity/item.entity';
import {
  DELAY_MS,
  ISSUE_CUSTOM_FIELDS,
  ISSUE_LIST_FIELDS,
  PROJECT_LIST_FIELDS,
  USER_LIST_FIELDS,
} from './youtrack.const';

@Injectable()
export class YoutrackService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly hubHTTP: HttpService,
    private readonly youtrackClient: Youtrack,
    private readonly configService: ConfigService,
  ) {
  }

  private top = 100;
  private headers = {
    Authorization: 'Bearer ' + this.configService.config.YOUTRACK_TOKEN,
  };

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.getListUserHttp(
      this.top * (page - 1),
      this.top,
    );
    if (usersYoutrack.length > 0) {
      const users = await Promise.all(
        usersYoutrack.map((user) => {
          return new UserEntity({
            youtrackId: user.id,
            hubId: user.ringId,
            fullName: user.fullName,
          });
        }),
      );
      await this.userRepository.save(users);
    }
    if (usersYoutrack.length === this.top) {
      await this.addNewUsers(++page);
    }
  }

  async addNewProjects(page = 1): Promise<void> {
    const projectsYoutrack = await this.getListProjectHttp(
      this.top * (page - 1),
      this.top,
    );
    if (projectsYoutrack.length > 0) {
      const projects = projectsYoutrack.map((project) => {
        return new ProjectEntity({
          youtrackId: project.id,
          hubResourceId: project.hubResourceId,
          name: project.name,
        });
      });
      await this.projectRepository.save(projects);
    }
    if (projectsYoutrack.length === this.top) {
      await this.addNewProjects(++page);
    }
  }

  async addNewIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.getListIssueHttp(
      this.top * (page - 1),
      this.top,
    );
    if (issuesYoutrack.length > 0) {
      const issues = await Promise.all(issuesYoutrack.map(async (issue,index) => {
        // await this.addNewIssueOne(issue);
          setTimeout(() =>  this.addNewIssueOne(issue),  DELAY_MS * index);

        //await this.itemRepository.save(issues);
      }));
    }
    if (issuesYoutrack.length === this.top) {
      await this.addNewIssues(++page);
    }
  }

  async addNewIssueOne(issue: IIssue): Promise<void>{
    let update = true;
    let newItemEntity = await this.itemRepository.findOne({ where: { youtrackId: issue.id } });
    if (isNil(newItemEntity)) {
      update = false;
      newItemEntity = new ItemEntity();
      newItemEntity.youtrackId = issue.id;
    }
    newItemEntity.name = issue.summary;
    await Promise.all(issue.customFields.map(async (field): Promise<void> => {
      if (get(ISSUE_CUSTOM_FIELDS, field.name) && (!isNil(field.value))) {
        const keyIssue = get(ISSUE_CUSTOM_FIELDS, field.name);
        switch (field.name) {
          case 'Direction':
            newItemEntity.directionId = await this.getIdDirection(field.value.name, field.value.id);
            break;
          case 'Assignee':
            newItemEntity.assigneeUserId = await this.getIdUser(field.value.name, field.value.id);
            break;
          default:
            set(newItemEntity, keyIssue, field.value.name);
        }
      }
    }));
     if (issue.updater){
       newItemEntity.assigneeUserId = await this.getIdUser(issue.updater.fullName, issue.updater.id);
     }
    if ((issue.parent.issues.length > 0)&&(issue.parent.issues[0].id !== issue.id)) {
      newItemEntity.parentItemId = await this.getIdItem(
        issue.parent.issues[0].summary,
        issue.parent.issues[0].id
      );
    }
    try {
      await this.itemRepository.save(newItemEntity);
    }  catch (error){
      console.log(error);
    }
  }
  async getListUserHttp(skip?: number, top?: number): Promise<IUser[]> {
    const params = this.getParamQuery(USER_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/users', {
      headers: this.headers,
      params: params,
    });
  }

  async getListProjectHttp(skip?: number, top?: number): Promise<IProject[]> {
    const params = this.getParamQuery(PROJECT_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/admin/projects', {
      headers: this.headers,
      params: params,
    });
  }

  async getListIssueHttp(skip?: number, top?: number): Promise<IIssue[]> {
    const params = this.getParamQuery(ISSUE_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<IIssue[]>('/issues', {
      headers: this.headers,
      params: params,
    });
  }

  async getListIssue(query?: string): Promise<ReducedIssue[]> {
    if (query) {
      return this.youtrackClient.issues.search(query);
    }
    return this.youtrackClient.issues.search('project: TR and updated: Today');
  }

  private async getIdDirection(direction: string, youtrackDirectionId: string): Promise<number> {
    let findDirection = await this.directionRepository.findOne({
      where: { name: direction },
    });
    if (!findDirection) {
      findDirection = await this.directionRepository.save(
        new DirectionEntity({ name: direction, youtrackId: youtrackDirectionId }),
      );
    }
    return findDirection.id;
  }

  private async getIdUser(fullName: string, youtrackUserId: string): Promise<number> {
    let findUser = await this.userRepository.findOne({
      where: { fullName },
    });
    if (!findUser) {
      findUser = await this.userRepository.save(
        new UserEntity({ fullName, youtrackId: youtrackUserId }),
      );
    }
    return findUser.id;
  }

  private async getIdItem (name: string, youtrackItemId: string): Promise<number> {
    let findItem = await this.itemRepository.findOne({
      where: { youtrackId: youtrackItemId},
    });
    if (!findItem) {
      findItem = await this.itemRepository.save(
        new ItemEntity({ name, youtrackId: youtrackItemId })
      );
    }
    return findItem.id;
  }

  private getParamQuery(
    fields: string,
    skip?: number,
    top?: number,
  ): Record<string, unknown> {
    let params = { fields: fields };
    if (skip) {
      params = merge(params, { $skip: skip });
    }
    if (top) {
      params = merge(params, { $top: top });
    }
    return params;
  }

  private async setGetQueryYoutrack<T>(
    url: string,
    config: Record<string, unknown>,
  ): Promise<T> {
    let response = undefined;
    try {
      response = await this.hubHTTP.get(url, config).pipe().toPromise();
      response = response.data;
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}
