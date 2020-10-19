import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';
import { IIssue, IProject, IUser } from '../youtrack/youtrack.interface';
import { IProjectTeam, PROJECT_TEAMS_LIST_FIELDS } from './hub.interface';
import { getParamQuery } from '../shared/http.function';
import { DELAY_MS, ISSUE_CUSTOM_FIELDS } from '../youtrack/youtrack.const';
import { ItemEntity } from '../database/entity/item.entity';

@Injectable()
export class HubService {
  constructor(
    private readonly hubHTTP: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
      await Promise.all(TeamsHub.map(async (team,index) => {
        await new Promise((resolve) => {
          setTimeout((that) => {
            this.addNewProjectTeamOne(team);
            resolve();
          },  DELAY_MS*index, this);
        });
      }));
    }
    if (TeamsHub.length === this.top) {
      await this. addNewProjectTeams(++page);
    }
  }

  async addNewProjectTeamOne(team: IProjectTeam): Promise<void>{
  /*  let newItemEntity = await this.itemRepository.findOne({ where: { youtrackId: issue.id } });
    if (isNil(newItemEntity)) {
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
            if(!isNil(field.value.name)){
              set(newItemEntity, keyIssue, field.value.name);
            }
        }
      }
    }));
    if (issue.updater){
      newItemEntity.assigneeUserId = await this.getIdUser(issue.updater.fullName, issue.updater.id);
    }
    if (issue.project){
      newItemEntity.projectId = await this.getIdProject(issue.project.name, issue.project.id);
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
    }*/
  }

  async getListProjectTeam(skip?: number, top?: number): Promise<IProjectTeam[]> {
    let response = undefined;
      try {
        const params = getParamQuery(PROJECT_TEAMS_LIST_FIELDS, skip, top);
        response = this.setGetQueryYoutrack<IProject[]>('/projectteams', {
          headers: this.headers,
          params: params,
        });
      return response;
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
