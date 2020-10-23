import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { IProjectTeam} from './hub.interface';
import { DELAY_MS } from '../youtrack/youtrack.const';
import { isNil } from 'lodash';
import { ProjectTeamEntity } from '../database/entity/project-team.entity';
import { HttpHubService } from '../http-hub/http-hub.service';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';

@Injectable()
export class HubService {
  private top = 100;
  headers = {
    Authorization: 'Bearer ' + this.configService.config.HUB_TOKEN,
  };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectTeamRepository: ProjectTeamRepository,
    private readonly hubHTTP: HttpHubService,
    private readonly configService: ConfigService,
  ) {
  }

  async addNewProjectTeams(page = 1): Promise<void> {
    const TeamsHub = await this.hubHTTP.getListProjectTeam(
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
    let newTeamEntity: ProjectTeamEntity = await this.projectTeamRepository.findOne({
      where: { hubId: team.id },
      relations: ['users'],
    });
    if (isNil(newTeamEntity)) {
      newTeamEntity = new ProjectTeamEntity();
      newTeamEntity.hubId = team.id;
    }
    if (!isNil(team.users) && team.users.length > 0) {
      await Promise.all(team.users.map(async (user) => {
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
}
