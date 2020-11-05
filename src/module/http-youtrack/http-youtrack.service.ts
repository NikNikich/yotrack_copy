import { HttpService, Injectable, Logger } from '@nestjs/common';
import {
  IIssue,
  IProject,
  ITimeTracking,
  IUser,
} from '../youtrack/youtrack.interface';
import { getParamQuery } from '../shared/http.function';
import {
  ISSUE_LIST_FIELDS,
  PROJECT_LIST_FIELDS,
  TRACK_LIST_FIELDS,
  USER_LIST_FIELDS,
} from './http-youtrack.const';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HttpYoutrackService {
  private readonly logger: Logger = new Logger(HttpYoutrackService.name);
  private readonly headers = {
    Authorization: 'Bearer ' + this.configService.config.YOUTRACK_TOKEN,
  };

  constructor(
    private readonly youtrackHTTP: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getListUserHttp(skip?: number, top?: number): Promise<IUser[]> {
    const params = getParamQuery(USER_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/users', {
      headers: this.headers,
      params: params,
    });
  }

  async getListProjectHttp(skip?: number, top?: number): Promise<IProject[]> {
    const params = getParamQuery(PROJECT_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<IProject[]>('/admin/projects', {
      headers: this.headers,
      params: params,
    });
  }

  async getListIssueHttp(
    skip?: number,
    top?: number,
    query?: string,
  ): Promise<IIssue[]> {
    const params = getParamQuery(ISSUE_LIST_FIELDS, skip, top, query);
    return this.setGetQueryYoutrack<IIssue[]>('/issues', {
      headers: this.headers,
      params: params,
    });
  }

  async getListIssueTrackHttp(
    issueId: string,
    skip?: number,
    top?: number,
  ): Promise<ITimeTracking[]> {
    const params = getParamQuery(TRACK_LIST_FIELDS, skip, top);
    return this.setGetQueryYoutrack<ITimeTracking[]>(
      `/issues/${issueId}/timeTracking/workItems`,
      {
        headers: this.headers,
        params: params,
      },
    );
  }

  async getIssueHttp(issueId: string, query?: string): Promise<IIssue> {
    const params = getParamQuery(ISSUE_LIST_FIELDS, null, null, query);
    return this.setGetQueryYoutrack<IIssue>(`/issues/${issueId}/`, {
      headers: this.headers,
      params: params,
    });
  }

  async setGetQueryYoutrack<T>(
    url: string,
    config: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response = await this.youtrackHTTP.get(url, config).toPromise();
      return response.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
