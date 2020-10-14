import { HttpService, Injectable } from '@nestjs/common';
import { ReducedIssue, Youtrack } from 'youtrack-rest-client';
import { UserEntity } from '../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionEntity } from '../database/entity/direction.entity';
import { ConfigService } from '../config/config.service';
import { IProject, IUser } from './youtrack.interface';
import { keysIn, merge, keys, forIn } from 'lodash';
import { ProjectEntity } from '../database/entity/project.entity';

@Injectable()
export class YoutrackService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    private readonly hubHTTP: HttpService,
    private readonly youtrackClient: Youtrack,
    private readonly configService: ConfigService,
  ) {
  }

  private top = 100;
  private userListFields = 'id,fullName,ringId';
  private projectListFields = 'id,name,hubResourceId';
  private headers = {
    'Authorization': 'Bearer ' + this.configService.config.YOUTRACK_TOKEN,
  };

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.getListUserHttp(
      this.top * (page - 1),
      this.top,
    );
    if (usersYoutrack.length > 0) {
      const users = await Promise.all(usersYoutrack.map((user) => {
        return new UserEntity({
          youtrackId: user.id,
          hubId: user.ringId,
          fullName: user.fullName,
        });
      }));
      await this.userRepository.save(users);
    }
    if (usersYoutrack.length === this.top) {
      await this.addNewUsers(++page);
    }
  }

  async addNewProjects(page = 1): Promise<void> {
    const projectsYoutrack = await this.getListProjectHttp(
      this.top * (page-1),
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

  async getListUserHttp(skip?: number, top?: number): Promise<IUser[]> {
    const params = this.getParamQuery(this.userListFields, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/users',
      {
        headers: this.headers,
        params: params,
      });
  }

  async getListProjectHttp(skip?: number, top?: number): Promise<IProject[]> {
    const params = this.getParamQuery(this.projectListFields, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/admin/projects',
      {
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

  private async getIdDirection(direction: string): Promise<number> {
    let findDirection = await this.directionRepository.findOne({ where: { name: direction } });
    if (!findDirection) {
      findDirection = await this.directionRepository.save(new DirectionEntity({ name: direction }));
    }
    return findDirection.id;
  }

  private getParamQuery(fields: string, skip?: number, top?: number): Record<string, unknown> {
    let params = { 'fields': fields };
    if (skip) {
      params = merge(params, { '$skip': skip });
    }
    if (top) {
      params = merge(params, { '$top': top });
    }
    return params;
  }

  private async setGetQueryYoutrack<T>(url: string, config: Record<string, unknown>): Promise<T> {
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