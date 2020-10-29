import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { IProjectTeam } from './hub.interface';
import { DELAY_MS } from '../youtrack/youtrack.const';
import { isNil } from 'lodash';
import { ProjectTeamEntity } from '../database/entity/project-team.entity';
import { HttpHubService } from '../http-hub/http-hub.service';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';
import { IIdName } from '../youtrack/youtrack.interface';
import { UserEntity } from '../database/entity/user.entity';

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
  ) {}

  async addNewProjectTeams(page = 1): Promise<void> {
    const TeamsHub = await this.hubHTTP.getListProjectTeam(
      this.top * (page - 1),
      this.top,
    );
    if (TeamsHub.length > 0) {
      await Promise.all(
        TeamsHub.map(async (team: IProjectTeam, index: number) => {
          await new Promise((resolve) => {
            setTimeout(
              () => {
                this.addNewProjectTeamOne(team);
                resolve();
              },
              DELAY_MS * index,
              this,
            );
          });
        }),
      );
    }
    if (TeamsHub.length === this.top) {
      await this.addNewProjectTeams(++page);
    }
  }

  async addNewProjectTeamOne(team: IProjectTeam): Promise<void> {
    const newTeamEntity = await this.projectTeamRepository.findByHubIdOrCreateNew(
      team.id,
    );
    if (!isNil(team.users) && team.users.length > 0) {
      await Promise.all(
        team.users.map(async (user: IIdName) => {
          const findUser = await this.userRepository.findOne({
            where: { hubId: user.id },
          });
          if (!isNil(findUser)) {
            if (isNil(newTeamEntity.users)) {
              newTeamEntity.users = [findUser];
            } else {
              if (
                !newTeamEntity.users.find(
                  (user: UserEntity) => user.id === findUser.id,
                )
              ) {
                newTeamEntity.users.push(findUser);
              }
            }
          }
        }),
      );
    }
    newTeamEntity.name = team.name;
    try {
      await this.projectTeamRepository.save(newTeamEntity);
    } catch (error) {
      console.error(error);
    }
    if (
      !isNil(team.project) &&
      !isNil(team.project.resource) &&
      team.project.resource.length > 0
    ) {
      await Promise.all(
        team.project.resource.map(
          async (resourceOne: IIdName, index: number) => {
            await new Promise((resolve) => {
              setTimeout(
                () => {
                  this.addProjectTeamIdInProject(
                    resourceOne.id,
                    newTeamEntity.id,
                  );
                  resolve();
                },
                DELAY_MS * index,
                this,
              );
            });
          },
        ),
      );
    }
  }

  async addProjectTeamIdInProject(
    hubId: string,
    projectTeamId: number,
  ): Promise<void> {
    const findProject = await this.projectRepository.findOne({
      where: { hubId },
    });
    if (!isNil(findProject) && findProject.projectTeamId !== projectTeamId) {
      findProject.projectTeamId = projectTeamId;
      await this.projectRepository.save(findProject);
    }
  }
}
