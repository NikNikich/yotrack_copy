import { Injectable, Logger } from '@nestjs/common';
import { IProjectTeam } from './hub.interface';
import { DELAY_MS } from '../youtrack/youtrack.const';
import { isNil } from 'lodash';
import { HttpHubService } from '../http-hub/http-hub.service';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';
import { IIdName } from '../youtrack/youtrack.interface';
import { UserEntity } from '../database/entity/user.entity';
import { ProjectTeamEntity } from '../database/entity/project-team.entity';

@Injectable()
export class HubService {
  private top = 100;
  private readonly logger: Logger = new Logger(HubService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectTeamRepository: ProjectTeamRepository,
    private readonly hubHTTP: HttpHubService,
  ) {}

  async addNewProjectTeams(page = 1): Promise<void> {
    const teamsHub = await this.hubHTTP.getListProjectTeam(
      this.top * (page - 1),
      this.top,
    );
    const isExistTeamsHubList = teamsHub && teamsHub.length > 0;
    if (isExistTeamsHubList) {
      await this.processingHubHttpQueryTeam(teamsHub);
      const isAchieveMaxLimitTeams = teamsHub.length === this.top;
      if (isAchieveMaxLimitTeams) {
        await this.addNewProjectTeams(++page);
      }
    }
  }

  async processingHubHttpQueryTeam(TeamsHub: IProjectTeam[]): Promise<void> {
    await Promise.all(
      TeamsHub.map(
        async (team: IProjectTeam, index: number): Promise<void> => {
          await new Promise((resolve, reject) => {
            setTimeout(
              () => {
                try {
                  this.addNewProjectTeamOne(team);
                  resolve();
                } catch (error) {
                  reject(error);
                }
              },
              DELAY_MS * index,
              this,
            );
          });
        },
      ),
    );
  }

  async addNewProjectTeamOne(team: IProjectTeam): Promise<void> {
    let newTeamEntity = await this.projectTeamRepository.findByHubIdOrCreateNew(
      team.id,
    );
    const isExistUsers = !isNil(team.users) && team.users.length > 0;
    if (isExistUsers) {
      await Promise.all(
        team.users.map(
          async (user: IIdName): Promise<void> => {
            newTeamEntity = await this.findAndAddUserTeam(newTeamEntity, user);
          },
        ),
      );
    }
    newTeamEntity.name = team.name;
    try {
      await this.projectTeamRepository.save(newTeamEntity);
    } catch (error) {
      this.logger.error(error);
    }
    const isExistProjectResource =
      !isNil(team.project) &&
      !isNil(team.project.resource) &&
      team.project.resource.length > 0;
    if (isExistProjectResource) {
      await Promise.all(
        team.project.resource.map(
          async (resourceOne: IIdName, index: number): Promise<void> => {
            await this.processingHubHttpQueryResource(
              newTeamEntity,
              resourceOne,
              index,
            );
          },
        ),
      );
    }
  }

  async processingHubHttpQueryResource(
    newTeamEntity: ProjectTeamEntity,
    resourceOne: IIdName,
    index: number,
  ): Promise<void> {
    await new Promise((resolve, reject) => {
      setTimeout(
        () => {
          try {
            this.addProjectTeamIdInProject(resourceOne.id, newTeamEntity.id);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        DELAY_MS * index,
        this,
      );
    });
  }

  async findAndAddUserTeam(
    newTeamEntity: ProjectTeamEntity,
    user: IIdName,
  ): Promise<ProjectTeamEntity> {
    const findUser = await this.userRepository.findOne({
      where: { hubId: user.id },
    });
    if (!isNil(findUser)) {
      if (isNil(newTeamEntity.users)) {
        newTeamEntity.users = [findUser];
      } else {
        const existNewTeam = newTeamEntity.users.find(
          (user: UserEntity) => user.id === findUser.id,
        );
        if (!existNewTeam) {
          newTeamEntity.users.push(findUser);
        }
      }
    }
    return newTeamEntity;
  }

  async addProjectTeamIdInProject(
    hubId: string,
    projectTeamId: number,
  ): Promise<void> {
    const findProject = await this.projectRepository.findOne({
      where: { hubId },
    });
    const executeProject =
      !isNil(findProject) && findProject.projectTeamId !== projectTeamId;
    if (executeProject) {
      findProject.projectTeamId = projectTeamId;
      await this.projectRepository.save(findProject);
    }
  }
}
