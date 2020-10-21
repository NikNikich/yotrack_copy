import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { IIssue, IProject, IUser } from '../youtrack/youtrack.interface';
import { IProjectTeam, PROJECT_TEAMS_LIST_FIELDS } from './hub.interface';
import { getParamQuery } from '../shared/http.function';
import { DELAY_MS, ISSUE_CUSTOM_FIELDS } from '../youtrack/youtrack.const';
import { set, merge, get, isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../database/entity/project.entity';
import { ProjectTeamEntity } from '../database/entity/projectTeam.entity';

@Injectable()
export class HubService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectTeamEntity)
    private readonly projectTeamRepository: Repository<ProjectTeamEntity>,
    private readonly hubHTTP: HttpService,
    private readonly configService: ConfigService,
  ) {
  }

  private top = 100;

  headers = {
    Authorization: 'Bearer ' + this.configService.config.HUB_TOKEN,
  };

  async addNewProjectTeams(page = 1): Promise<void> {
    const TeamsHub = await this.getListProjectTeam(
      this.top * (page - 1),
      this.top,
    );
    if (TeamsHub.length > 0) {
      await Promise.all(TeamsHub.map(async (team, index) => {
        await new Promise((resolve) => {
          setTimeout((that) => {
            this.addNewProjectTeamOne(team);
            resolve();
          }, DELAY_MS * index, this);
        });
      }));
    }
    if (TeamsHub.length === this.top) {
      await this.addNewProjectTeams(++page);
    }
  }

  async addNewProjectTeamOne(team: IProjectTeam): Promise<void> {
    let newTeamEntity = await this.projectTeamRepository.findOne({
      where: { hubId: team.id },
      relations: ['users'],
    });
    if (isNil(newTeamEntity)) {
      newTeamEntity = new ProjectTeamEntity();
      newTeamEntity.hubId = team.id;
    }
    if (!isNil(team.users) && team.users.length > 0) {
      await Promise.all(team.users.map(async (user, index) => {
        const findUser = await this.userRepository.findOne({ where: { hubId: user.id } });
        if (!isNil(findUser)) {
          if (isNil(newTeamEntity.users)) {
            newTeamEntity.users = [findUser];
          } else {
            if (!newTeamEntity.users.find((user) => user.id === findUser.id)) {
              newTeamEntity.users.push(findUser);
            }
          }
        }
      }));
    }
    newTeamEntity.name = team.name;
    try {
      await this.projectTeamRepository.save(newTeamEntity);
    } catch (error) {
      console.error(error);
    }
    if (!isNil(team.project) && !isNil(team.project.resource) && (team.project.resource.length > 0)) {
      await Promise.all(team.project.resource.map(async (resourceOne, index) => {
        const findProject = await this.projectRepository.findOne({ where: { hubId: resourceOne.id } });
        if (!isNil(findProject) && (findProject.projectTeamId !== newTeamEntity.id)) {
          findProject.projectTeamId = newTeamEntity.id;
        }
      }));
    }

  }

  async getListProjectTeam(skip?: number, top?: number): Promise<IProjectTeam[]> {
    let response = undefined;
    try {
      const params = getParamQuery(PROJECT_TEAMS_LIST_FIELDS, skip, top);
      response = await this.setGetQueryYoutrack<IProject[]>('/projectteams', {
        headers: this.headers,
        params: params,
      });
      return response.projectteams;
    } catch (error) {
      console.error(error);
    }
    return response;
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
