import { Injectable, Logger } from '@nestjs/common';
import {
  ICustomFields,
  IIssue,
  IIssueFieldValue,
  ITimeTracking,
} from './youtrack.interface';
import { set, get, isNil, isArray, isString, isNumber } from 'lodash';
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
import { IsNull } from 'typeorm';
import { isNumeric } from 'rxjs/internal-compatibility';
import { isIIssueFieldValue } from './youtrack.type-guard';

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
          const findUser = await this.userRepository.findByYoutrackIdOrCreateNew(
            user.id,
            user.fullName,
          );
          findUser.hubId = user.ringId;
          return findUser;
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
          const findProject = await this.projectRepository.findByYoutrackIdOrCreateNew(
            project.id,
          );
          findProject.name = project.name;
          findProject.hubResourceId = project.hubResourceId;
          return findProject;
        }),
      );
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
      const items = await Promise.all(
        issuesYoutrack.map(async (issue, index) => {
          return await new Promise((resolve) => {
            setTimeout(async () => {
              this.logger.log('processing add new item id = ' + issue.id);
              const newIssue = await this.addNewIssueOne(issue);
              resolve(newIssue);
            }, DELAY_MS * index);
          });
        }),
      );
      try {
        await this.itemRepository.save(items);
      } catch (error) {
        this.logger.log(error);
      }
    }
    if (issuesYoutrack.length === this.top) {
      await this.addNewIssues(++page);
    }
  }

  async addListIssueTimeTrack(issue: ItemEntity, page = 1): Promise<void> {
    const listTrackTime = await this.youtrackHTTP.getListIssueTrackHttp(
      issue.youtrackId,
      this.top * (page - 1),
      this.top,
    );
    if (!isNil(listTrackTime) && listTrackTime.length > 0) {
      const tracks = await Promise.all(
        listTrackTime.map(async (track) => {
          return this.addIssueTimeTrack(issue, track);
        }),
      );
      await this.timeTrackingRepository.save(tracks);
    }
    if (listTrackTime.length === this.top) {
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
      this.logger.log('length = ' + issuesYoutrack.length);
      const items = await Promise.all(
        issuesYoutrack.map(async (issue, index) => {
          return new Promise(async (resolve) => {
            setTimeout(async () => {
              this.logger.log('processing updating item id = ' + issue.id);
              const newIssue = await this.addNewIssueOne(issue, true);
              resolve(newIssue);
            }, DELAY_MS * index);
          });
        }),
      );
      try {
        await this.itemRepository.save(items);
      } catch (error) {
        this.logger.log(error);
      }
    }
    if (issuesYoutrack.length === this.top) {
      await this.updateIssues(++page);
    }
  }

  async updateNullProjectIssues(): Promise<void> {
    const issuesNullProject = await this.itemRepository.find({
      where: { projectId: IsNull() },
    });
    if (issuesNullProject.length > 0) {
      const items = await Promise.all(
        issuesNullProject.map(async (issueBD, index) => {
          return new Promise((resolve) => {
            setTimeout(
              async () => {
                const issue = await this.youtrackHTTP.getIssueHttp(
                  issueBD.youtrackId,
                );
                this.logger.log('processing update Null item id = ' + issue.id);
                const newIssue = await this.addNewIssueOne(
                  issue,
                  false,
                  issueBD.id,
                );
                resolve(newIssue);
              },
              DELAY_MS * index,
              this,
            );
          });
        }),
      );
      try {
        await this.itemRepository.save(items);
      } catch (error) {
        this.logger.log(error);
      }
      await this.updateNullProjectIssues();
    }
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
    if (
      issue.parent.issues.length > 0 &&
      issue.parent.issues[0].id !== issue.id
    ) {
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
        async (field): Promise<void> => {
          if (get(ISSUE_CUSTOM_FIELDS, field.name) && !isNil(field.value)) {
            switch (field.name) {
              case 'Week':
                if (isArray(field.value) && field.value.length > 0) {
                  item.week = field.value.map((value) => value.name).join(', ');
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
}
