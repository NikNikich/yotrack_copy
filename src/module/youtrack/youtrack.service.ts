import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../database/entity/user.entity';
import { DirectionEntity } from '../database/entity/direction.entity';
import { IIssue, ITimeTracking } from './youtrack.interface';
import { set, get, isNil, isArray } from 'lodash';
import { ProjectEntity } from '../database/entity/project.entity';
import { ItemEntity } from '../database/entity/item.entity';
import { DELAY_MS, ISSUE_CUSTOM_FIELDS } from './youtrack.const';
import { HttpYoutrackService } from '../http-youtrack/http-youtrack.service';
import { ISSUE_LIST_QUERY } from '../http-youtrack/http-youtrack.const';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ItemRepository } from '../database/repository/item.repository';
import { TimeTrackingEntity } from '../database/entity/time-tracking.entity';
import { TimeTrackingRepository } from '../database/repository/time-tracking.repository';

@Injectable()
export class YoutrackService {
  private readonly logger: Logger = new Logger(YoutrackService.name);
  private top = 100;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly directionRepository: DirectionRepository,
    private readonly itemRepository: ItemRepository,
    private readonly timeTrackingRepository: TimeTrackingRepository,
    private readonly youtrackHTTP: HttpYoutrackService,
  ) {}

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.youtrackHTTP.getListUserHttp(
      this.top * (page - 1),
      this.top,
    );
    if (usersYoutrack.length > 0) {
      const users = await Promise.all(
        usersYoutrack.map(async (user) => {
          const findUser = await this.userRepository.findOne({
            where: { youtrackId: user.id },
          });
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
    const isAchieveMaxLimitUser = usersYoutrack.length === this.top;
    if (isAchieveMaxLimitUser) {
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
          const findProject = await this.projectRepository.findOne({
            where: { youtrackId: project.id },
          });
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
        }),
      );
      await this.projectRepository.save(projects);
    }
    const isAchieveMaxLimitProjects = projectsYoutrack.length === this.top;
    if (isAchieveMaxLimitProjects) {
      await this.addNewProjects(++page);
    }
  }

  async addNewIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackHTTP.getListIssueHttp(
      this.top * (page - 1),
      this.top,
    );
    if (issuesYoutrack.length > 0) {
      await Promise.all(
        issuesYoutrack.map(async (issue, index) => {
          await new Promise((resolve) => {
            setTimeout(
              () => {
                this.addNewIssueOne(issue);
                resolve();
              },
              DELAY_MS * index,
              this,
            );
          });
        }),
      );
    }
    const isAchieveMaxLimitIssues = issuesYoutrack.length === this.top;
    if (isAchieveMaxLimitIssues) {
      await this.addNewIssues(++page);
    }
  }

  async addListIssueTimeTrack(issue: ItemEntity, page = 1): Promise<void> {
    const listTrackTime = await this.youtrackHTTP.getListIssueTrackHttp(
      issue.youtrackId,
      this.top * (page - 1),
      this.top,
    );
    const isExistListTrackTime =
      !isNil(listTrackTime) && listTrackTime.length > 0;
    if (isExistListTrackTime) {
      const tracks = await Promise.all(
        listTrackTime.map(async (track) => {
          return this.addIssueTimeTrack(issue, track);
        }),
      );
      await this.timeTrackingRepository.save(tracks);
    }
    const isAchieveMaxLimitRecord = listTrackTime.length === this.top;
    if (isAchieveMaxLimitRecord) {
      await this.addListIssueTimeTrack(issue, ++page);
    }
  }

  async updateIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackHTTP.getListIssueHttp(
      this.top * (page - 1),
      this.top,
      ISSUE_LIST_QUERY,
    );
    if (issuesYoutrack.length > 0) {
      await Promise.all(
        issuesYoutrack.map(async (issue, index) => {
          await new Promise((resolve) => {
            setTimeout(
              () => {
                this.addNewIssueOne(issue, true);
                resolve();
              },
              DELAY_MS * index,
              this,
            );
          });
        }),
      );
    }
    const isAchieveMaxLimitIssues = issuesYoutrack.length === this.top;
    if (isAchieveMaxLimitIssues) {
      await this.updateIssues(++page);
    }
  }

  async addNewIssueOne(issue: IIssue, isNewAlways = false): Promise<void> {
    let newItemEntity: ItemEntity;
    if (!isNewAlways) {
      newItemEntity = await this.itemRepository.findOne({
        where: { youtrackId: issue.id },
      });
    }
    const itemIsEmpty = isNil(newItemEntity) || isNewAlways;
    if (itemIsEmpty) {
      newItemEntity = new ItemEntity();
      newItemEntity.youtrackId = issue.id;
    }
    newItemEntity.name = issue.summary;
    await Promise.all(
      issue.customFields.map(
        async (field): Promise<void> => {
          const isExistCustomField =
            get(ISSUE_CUSTOM_FIELDS, field.name) && !isNil(field.value);
          if (isExistCustomField) {
            const keyIssue = get(ISSUE_CUSTOM_FIELDS, field.name);
            switch (field.name) {
              case 'Week':
                if (isArray(field.value) && field.value.length > 0) {
                  const weeks = field.value
                    .map((value) => value.name)
                    .join(', ');
                  set(newItemEntity, keyIssue, weeks);
                }
                break;
              case 'Direction':
                if (!isArray(field.value)) {
                  newItemEntity.directionId = await this.getIdDirection(
                    field.value.name,
                    field.value.id,
                  );
                }
                break;
              case 'Estimation':
              case 'Spent time':
                if (!isArray(field.value) && !isNil(field.value.presentation)) {
                  set(newItemEntity, keyIssue, field.value.presentation);
                }
                break;
              case 'Комментарий по % выполнению':
              case '% выполнения':
              case 'Start date':
              case 'End Date':
                set(newItemEntity, keyIssue, field.value);
                break;
              case 'Assignee':
                if (!isArray(field.value)) {
                  newItemEntity.assigneeUserId = await this.getIdUser(
                    field.value.name,
                    field.value.id,
                  );
                }
                break;
              default:
                if (!isArray(field.value) && !isNil(field.value.name)) {
                  set(newItemEntity, keyIssue, field.value.name);
                }
            }
          }
        },
      ),
    );
    if (issue.updater) {
      newItemEntity.updaterUserId = await this.getIdUser(
        issue.updater.fullName,
        issue.updater.id,
      );
    }
    if (issue.project) {
      newItemEntity.projectId = await this.getIdProject(
        issue.project.name,
        issue.project.id,
      );
    }
    const issuesParentIsExist =
      issue.parent.issues.length > 0 && issue.parent.issues[0].id !== issue.id;
    if (issuesParentIsExist) {
      newItemEntity.parentItemId = await this.getIdItem(
        issue.parent.issues[0].summary,
        issue.parent.issues[0].id,
      );
    }
    try {
      const saveItem = await this.itemRepository.save(newItemEntity);
      if (!isNil(saveItem)) {
        await this.addListIssueTimeTrack(saveItem);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  async addIssueTimeTrack(
    issue: ItemEntity,
    youtrackTrack: ITimeTracking,
  ): Promise<TimeTrackingEntity> {
    const timeTrack = await this.timeTrackingRepository.findByItemIdAndYoutrackIdOrCreate(
      issue.id,
      youtrackTrack.id,
    );
    if (!isNil(youtrackTrack.author)) {
      timeTrack.authorId = await this.getIdUser(
        youtrackTrack.author.fullName,
        youtrackTrack.author.id,
      );
    }
    if (!isNil(youtrackTrack.duration)) {
      timeTrack.duration = youtrackTrack.duration.presentation;
    }
    if (!isNil(youtrackTrack.date)) {
      timeTrack.date = new Date(youtrackTrack.date);
    }
    if (!isNil(youtrackTrack.text)) {
      timeTrack.text = youtrackTrack.text;
    }
    return timeTrack;
  }

  private async getIdDirection(
    direction: string,
    youtrackDirectionId: string,
  ): Promise<number> {
    let findDirection = await this.directionRepository.findOne({
      where: { name: direction },
    });
    if (!findDirection) {
      findDirection = await this.directionRepository.save(
        new DirectionEntity({
          name: direction,
          youtrackId: youtrackDirectionId,
        }),
      );
    }
    return findDirection.id;
  }

  private async getIdUser(
    fullName: string,
    youtrackUserId: string,
  ): Promise<number> {
    let findUser = await this.userRepository.findOne({
      where: { youtrackId: youtrackUserId },
    });
    if (!findUser) {
      findUser = await this.userRepository.save(
        new UserEntity({ fullName, youtrackId: youtrackUserId }),
      );
    }
    return findUser.id;
  }

  private async getIdItem(
    name: string,
    youtrackItemId: string,
    newAlways = false,
  ): Promise<number> {
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

  private async getIdProject(
    name: string,
    youtrackProjectId: string,
  ): Promise<number> {
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
