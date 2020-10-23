import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionEntity } from '../database/entity/direction.entity';
import { IIssue } from './youtrack.interface';
import { set,  get, isNil } from 'lodash';
import { ProjectEntity } from '../database/entity/project.entity';
import { ItemEntity } from '../database/entity/item.entity';
import {
  DELAY_MS,
  ISSUE_CUSTOM_FIELDS,
} from './youtrack.const';
import { getParamQuery } from '../shared/http.function';
import { HttpYoutrackService } from '../http-youtrack/http-youtrack.service';
import { ISSUE_LIST_QUERY } from '../http-youtrack/http-youtrack.const';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ItemRepository } from '../database/repository/item.repository';

@Injectable()
export class YoutrackService {
  private readonly logger: Logger = new Logger(YoutrackService.name);
  private top = 100;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly directionRepository: DirectionRepository,
    private readonly itemRepository: ItemRepository,
    private readonly youtrackHTTP: HttpYoutrackService,
  ) {
  }

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.youtrackHTTP.getListUserHttp(
      this.top * (page - 1),
      this.top,
    );
    if (usersYoutrack.length > 0) {
      const users = await Promise.all(
        usersYoutrack.map(async (user) => {
          const findUser = await this.userRepository.findOne({ where: { youtrackId: user.id } });
          if (!isNil(findUser)) {
            findUser.fullName = user.fullName;
            findUser.hubId = user.ringId;
            return findUser;
          } else {
            return new UserEntity({
              youtrackId: user.id,
              hubId: user.ringId,
              fullName: user.fullName,
            });
          }
        }),
      );
      await this.userRepository.save(users);
    }
    if (usersYoutrack.length === this.top) {
      await this.addNewUsers(++page);
    }
  }

  async addNewProjects(page = 1): Promise<void> {
    const projectsYoutrack = await this.youtrackHTTP.getListProjectHttp(
      this.top * (page - 1),
      this.top,
    );
    if (projectsYoutrack.length > 0) {
      const projects = await Promise.all(
        projectsYoutrack.map(async (project) => {
          const findProject = await this.projectRepository.findOne({ where: { youtrackId: project.id } });
          if (!isNil(findProject)) {
            findProject.name = project.name;
            findProject.hubResourceId = project.hubResourceId;
            return findProject;
          } else {
            return new ProjectEntity({
              youtrackId: project.id,
              hubResourceId: project.hubResourceId,
              name: project.name,
            });
          }
        }));
      await this.projectRepository.save(projects);
    }
    if (projectsYoutrack.length === this.top) {
      await this.addNewProjects(++page);
    }
  }

  async addNewIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackHTTP.getListIssueHttp(
      this.top * (page - 1),
      this.top,
    );
    if (issuesYoutrack.length > 0) {
      await Promise.all(issuesYoutrack.map(async (issue, index) => {
        await new Promise((resolve) => {
          setTimeout((that) => {
            this.addNewIssueOne(issue);
            resolve();
          }, DELAY_MS * index, this);
        });
      }));
    }
    if (issuesYoutrack.length === this.top) {
      await this.addNewIssues(++page);
    }
  }

  async updateIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackHTTP.getListIssueHttp(
      this.top * (page - 1),
      this.top,
      ISSUE_LIST_QUERY,
    );
    if (issuesYoutrack.length > 0) {
      await Promise.all(issuesYoutrack.map(async (issue, index) => {
        await new Promise((resolve) => {
          setTimeout((that) => {
            this.addNewIssueOne(issue, true);
            resolve();
          }, DELAY_MS * index, this);
        });
      }));
    }
    if (issuesYoutrack.length === this.top) {
      await this.updateIssues(++page);
    }
  }

  async addNewIssueOne(issue: IIssue, newAlways = false): Promise<void> {
    let newItemEntity: ItemEntity;
    if (!newAlways) {
      newItemEntity = await this.itemRepository.findOne({ where: { youtrackId: issue.id } });
    }
    if (isNil(newItemEntity) || newAlways) {
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
          case 'Estimation':
          case 'Spent time':
            if (!isNil(field.value.presentation)) {
              set(newItemEntity, keyIssue, field.value.presentation);
            }
            break;
          case '% выполнения':
          case 'Start date':
          case 'End Date':
            set(newItemEntity, keyIssue, field.value);
            break;
          case 'Assignee':
            newItemEntity.assigneeUserId = await this.getIdUser(field.value.name, field.value.id);
            break;
          default:
            if (!isNil(field.value.name)) {
              set(newItemEntity, keyIssue, field.value.name);
            }
        }
      }
    }));
    if (issue.updater) {
      newItemEntity.updaterUserId = await this.getIdUser(issue.updater.fullName, issue.updater.id);
    }
    if (issue.project) {
      newItemEntity.projectId = await this.getIdProject(issue.project.name, issue.project.id);
    }
    if ((issue.parent.issues.length > 0) && (issue.parent.issues[0].id !== issue.id)) {
      newItemEntity.parentItemId = await this.getIdItem(
        issue.parent.issues[0].summary,
        issue.parent.issues[0].id,
      );
    }
    try {
      await this.itemRepository.save(newItemEntity);
    } catch (error) {
      this.logger.log(error);
    }
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
      where: { youtrackId: youtrackUserId},
    });
    if (!findUser) {
      findUser = await this.userRepository.save(
        new UserEntity({ fullName, youtrackId: youtrackUserId }),
      );
    }
    return findUser.id;
  }

  private async getIdItem(name: string, youtrackItemId: string, newAlways = false): Promise<number> {
    let findItem = await this.itemRepository.findOne({
      where: { youtrackId: youtrackItemId },
    });
    if (!findItem) {
      if (newAlways) {
        return null;
      } else {
        findItem = await this.itemRepository.save(
          new ItemEntity({ name, youtrackId: youtrackItemId }),
        );
      }
    }
    return findItem.id;
  }

  private async getIdProject(name: string, youtrackProjectId: string): Promise<number> {
    let findProject = await this.projectRepository.findOne({
      where: { youtrackId: youtrackProjectId },
    });
    if (!findProject) {
      findProject = await this.projectRepository.save(
        new ProjectEntity({ name, youtrackId: youtrackProjectId }),
      );
    }
    return findProject.id;
  }

}
