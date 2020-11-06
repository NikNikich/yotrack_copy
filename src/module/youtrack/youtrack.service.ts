import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ICustomFields,
  IIssue,
  IIssueFieldValue,
  IProject,
  ITimeTracking,
  IUser,
} from './youtrack.interface';
import { get, isNil, isArray, isString, isNumber } from 'lodash';
import { ItemEntity } from '../database/entity/item.entity';
import { DELAY_MS, ISSUE_CUSTOM_FIELDS } from './youtrack.const';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ItemRepository } from '../database/repository/item.repository';
import { TimeTrackingEntity } from '../database/entity/time-tracking.entity';
import { TimeTrackingRepository } from '../database/repository/time-tracking.repository';
import { IsNull } from 'typeorm';
import { isIIssueFieldValue } from './youtrack.type-guard';
import { UserEntity } from '../database/entity/user.entity';
import { ProjectEntity } from '../database/entity/project.entity';
import { YoutrackServiceDS } from '../youtrack-ds/youtrack-ds.service';
import {
  ISSUE_LIST_QUERY_DAY,
  ISSUE_LIST_QUERY_MONTH,
  YOUTRACK_DS_KEY,
} from '../youtrack-ds/youtrack-ds.const';
import { ConfigService } from '../config/config.service';

@Injectable()
export class YoutrackService {
  private readonly logger: Logger = new Logger(YoutrackService.name);
  private top = this.configService.config.TOP_QUERY_LIST;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly directionRepository: DirectionRepository,
    private readonly itemRepository: ItemRepository,
    private readonly timeTrackingRepository: TimeTrackingRepository,
    @Inject(YOUTRACK_DS_KEY)
    private readonly youtrackDS: YoutrackServiceDS,
  ) {}

  async addNewUsers(page = 1): Promise<void> {
    const usersYoutrack = await this.youtrackDS.getListUserDS(
      this.top * (page - 1),
      this.top,
    );
    const isExistUsersYoutrack =
      !isNil(usersYoutrack) && usersYoutrack.length > 0;
    if (isExistUsersYoutrack) {
      await this.processingQueryByUsers(usersYoutrack);
      const isAchieveMaxLimitUser = usersYoutrack.length === this.top;
      if (isAchieveMaxLimitUser) {
        await this.addNewUsers(++page);
      }
    }
  }

  async processingQueryByUsers(usersYoutrack: IUser[]): Promise<void> {
    const users = await Promise.all(
      usersYoutrack.map(
        async (user: IUser): Promise<UserEntity> => {
          const findUser = await this.userRepository.findByYoutrackIdOrCreateNew(
            user.id,
            user.fullName,
          );
          findUser.hubId = user.ringId;
          return findUser;
        },
      ),
    );
    await this.userRepository.save(users);
  }

  async addNewProjects(page = 1): Promise<void> {
    const projectsYoutrack = await this.youtrackDS.getListProjectDS(
      this.top * (page - 1),
      this.top,
    );
    const isExistProjectsYoutrack =
      !isNil(projectsYoutrack) && projectsYoutrack.length > 0;
    if (isExistProjectsYoutrack) {
      await this.processingQueryByProjects(projectsYoutrack);
      const isAchieveMaxLimitProjects = projectsYoutrack.length === this.top;
      if (isAchieveMaxLimitProjects) {
        await this.addNewProjects(++page);
      }
    }
  }

  async processingQueryByProjects(projectsYoutrack: IProject[]): Promise<void> {
    const projects = await Promise.all(
      projectsYoutrack.map(
        async (project: IProject): Promise<ProjectEntity> => {
          const findProject = await this.projectRepository.findByYoutrackIdOrCreateNew(
            project.id,
          );
          findProject.name = project.name;
          findProject.hubResourceId = project.hubResourceId;
          return findProject;
        },
      ),
    );
    await this.projectRepository.save(projects);
  }

  async addNewIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackDS.getListIssueDS(
      this.top * (page - 1),
      this.top,
      ISSUE_LIST_QUERY_MONTH,
    );
    const isExistIssuesYoutrack =
      !isNil(issuesYoutrack) && issuesYoutrack.length > 0;
    if (isExistIssuesYoutrack) {
      await this.processingQueryByIssues(issuesYoutrack);
      const isAchieveMaxLimitIssues = issuesYoutrack.length === this.top;
      if (isAchieveMaxLimitIssues) {
        await this.addNewIssues(++page);
      }
    }
  }

  async processingQueryByIssues(
    issuesYoutrack: IIssue[],
    updated = false,
  ): Promise<void> {
    const items = await Promise.all(
      issuesYoutrack.map(
        async (issue: IIssue, index: number): Promise<ItemEntity> => {
          return await new Promise((resolve, reject) => {
            setTimeout(async () => {
              if (updated) {
                this.logger.log('processing updating item id = ' + issue.id);
              } else {
                this.logger.log('processing add new item id = ' + issue.id);
              }
              try {
                const newIssue = await this.addNewIssueOne(issue, updated);
                resolve(newIssue);
              } catch (error) {
                reject(error);
              }
            }, DELAY_MS * index);
          });
        },
      ),
    );
    try {
      await this.itemRepository.save(items);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async addListIssueTimeTrack(issue: ItemEntity, page = 1): Promise<void> {
    const listTrackTime = await this.youtrackDS.getListIssueTrackDS(
      issue.youtrackId,
      this.top * (page - 1),
      this.top,
    );
    const isExistListTrackTime =
      !isNil(listTrackTime) && listTrackTime.length > 0;
    if (isExistListTrackTime) {
      const tracks = await Promise.all(
        listTrackTime.map(
          async (track: ITimeTracking): Promise<TimeTrackingEntity> => {
            return this.addIssueTimeTrack(issue, track);
          },
        ),
      );
      await this.timeTrackingRepository.save(tracks);
      const isAchieveMaxLimitRecord = listTrackTime.length === this.top;
      if (isAchieveMaxLimitRecord) {
        await this.addListIssueTimeTrack(issue, ++page);
      }
    }
  }

  async updateIssues(page = 1): Promise<void> {
    const issuesYoutrack = await this.youtrackDS.getListIssueDS(
      this.top * (page - 1),
      this.top,
      ISSUE_LIST_QUERY_DAY,
    );
    if (issuesYoutrack.length > 0) {
      await this.processingQueryByIssues(issuesYoutrack, true);
    }
    const isAchieveMaxLimitIssues = issuesYoutrack.length === this.top;
    if (isAchieveMaxLimitIssues) {
      await this.updateIssues(++page);
    }
  }

  async updateNullProjectIssues(): Promise<void> {
    const issuesNullProject = await this.itemRepository.find({
      where: { projectId: IsNull() },
    });
    const isExistIssuesNullProject =
      !isNil(issuesNullProject) && issuesNullProject.length > 0;
    if (isExistIssuesNullProject) {
      const items = await Promise.all(
        issuesNullProject.map(
          async (issueBD: ItemEntity, index: number): Promise<ItemEntity> => {
            return this.processingQueryByUpdatingIssues(issueBD, index);
          },
        ),
      );
      try {
        await this.itemRepository.save(items);
      } catch (error) {
        this.logger.log(error);
      }
      await this.updateNullProjectIssues();
    }
  }

  async processingQueryByUpdatingIssues(
    issueBD: ItemEntity,
    index: number,
  ): Promise<ItemEntity> {
    return new Promise((resolve, reject) => {
      setTimeout(
        async () => {
          const issue = await this.youtrackDS.getIssueDS(issueBD.youtrackId);
          this.logger.log('processing update Null item id = ' + issue.id);
          try {
            const newIssue = await this.addNewIssueOne(
              issue,
              false,
              issueBD.id,
            );
            resolve(newIssue);
          } catch (error) {
            reject(error);
          }
        },
        DELAY_MS * index,
        this,
      );
    });
  }

  async addNewIssueOne(
    issue: IIssue,
    newAlways = false,
    BDIssueId = 0,
  ): Promise<ItemEntity> {
    let newItemEntity: ItemEntity;
    if (newAlways) {
      newItemEntity = await this.itemRepository.createNewAndSave(
        issue.id,
        issue.summary,
      );
    } else {
      if (BDIssueId > 0) {
        newItemEntity = await this.itemRepository.findByIdOrCreateNew(
          BDIssueId,
          issue.id,
          issue.summary,
        );
      } else {
        newItemEntity = await this.itemRepository.findByYoutrackIdOrCreateNew(
          issue.id,
          issue.summary,
        );
      }
    }
    newItemEntity.name = issue.summary;
    newItemEntity = await this.setCustomFieldsIssue(
      issue.customFields,
      newItemEntity,
    );
    if (issue.updater) {
      newItemEntity.updaterUserId = await this.userRepository.getIdFoundedByYoutrackIdOrCreated(
        issue.updater.fullName,
        issue.updater.id,
      );
    }
    if (issue.project) {
      newItemEntity.projectId = await this.projectRepository.getIdFoundedByYoutrackIdOrCreated(
        issue.project.name,
        issue.project.id,
        issue.project.hubResourceId,
      );
    }
    const executeParentId =
      issue.parent.issues.length > 0 && issue.parent.issues[0].id !== issue.id;
    if (executeParentId) {
      newItemEntity.parentItemId = await this.itemRepository.getIdFoundedByYoutrackIdOrCreated(
        issue.parent.issues[0].summary,
        issue.parent.issues[0].id,
      );
    }
    await this.addListIssueTimeTrack(newItemEntity);
    return newItemEntity;
  }

  async setCustomFieldsIssue(
    customFields: ICustomFields[],
    item: ItemEntity,
  ): Promise<ItemEntity> {
    await Promise.all(
      customFields.map(
        async (field: ICustomFields): Promise<void> => {
          const isExistCustomField =
            get(ISSUE_CUSTOM_FIELDS, field.name) && !isNil(field.value);
          if (isExistCustomField) {
            switch (field.name) {
              case 'Week':
                if (isArray(field.value) && field.value.length > 0) {
                  item.week = field.value
                    .map((value: IIssueFieldValue): string => value.name)
                    .join(', ');
                }
                break;
              case 'Direction':
                if (isIIssueFieldValue(field.value)) {
                  item.directionId = await this.directionRepository.getIdFoundedByYoutrackIdOrCreated(
                    field.value.name,
                    field.value.id,
                  );
                }
                break;
              case 'Estimation':
                if (
                  isIIssueFieldValue(field.value) &&
                  !isNil(field.value.minutes)
                ) {
                  item.estimationTime = field.value.minutes;
                }
                break;
              case 'Spent time':
                if (
                  isIIssueFieldValue(field.value) &&
                  !isNil(field.value.minutes)
                ) {
                  item.spentTime = field.value.minutes;
                }
                break;
              case 'Комментарий по % выполнению':
                if (isString(field.value)) {
                  item.comment = field.value;
                }
                break;
              case '% выполнения':
                if (isNumber(field.value)) {
                  item.percent = field.value;
                }
                break;
              case 'Start date':
                if (isNumber(field.value))
                  item.startDate = new Date(field.value);
                break;
              case 'End Date':
                if (isNumber(field.value)) item.endDate = new Date(field.value);
                break;
              case 'Assignee':
                if (isIIssueFieldValue(field.value)) {
                  item.assigneeUserId = await this.userRepository.getIdFoundedByYoutrackIdOrCreated(
                    field.value.name,
                    field.value.id,
                  );
                }
                break;
              default:
                break;
            }
          }
        },
      ),
    );
    return item;
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
      timeTrack.authorId = await this.userRepository.getIdFoundedByYoutrackIdOrCreated(
        youtrackTrack.author.fullName,
        youtrackTrack.author.id,
      );
    }
    if (!isNil(youtrackTrack.duration)) {
      timeTrack.minutes = youtrackTrack.duration.minutes;
    }
    if (!isNil(youtrackTrack.date)) {
      timeTrack.date = new Date(youtrackTrack.date);
    }
    if (!isNil(youtrackTrack.text)) {
      timeTrack.text = youtrackTrack.text;
    }
    return timeTrack;
  }
}
