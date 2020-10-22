import { HttpService, Injectable } from '@nestjs/common';
import { IProjectTeam} from '../hub/hub.interface';
import { getParamQuery } from '../shared/http.function';
import { IProject } from '../youtrack/youtrack.interface';
import { ConfigService } from '../config/config.service';
import { PROJECT_TEAMS_LIST_FIELDS } from './http-hub.const';

@Injectable()
export class HttpHubService {
  headers = {
    Authorization: 'Bearer ' + this.configService.config.HUB_TOKEN,
  };

  constructor(
    private readonly hubHTTP: HttpService,
    private readonly configService: ConfigService,
  ) {
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