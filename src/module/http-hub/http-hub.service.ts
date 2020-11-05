import { HttpService, Injectable, Logger } from '@nestjs/common';
import { IProjectTeam } from '../hub/hub.interface';
import { getParamQuery } from '../shared/http.function';
import { ConfigService } from '../config/config.service';
import { PROJECT_TEAMS_LIST_FIELDS } from './http-hub.const';
import { IQueryProjectTeam } from './http-hub.interface';

@Injectable()
export class HttpHubService {
  private readonly headers = {
    Authorization: 'Bearer ' + this.configService.config.HUB_TOKEN,
  };
  private readonly logger: Logger = new Logger(HttpHubService.name);

  constructor(
    private readonly hubHTTP: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getListProjectTeam(
    skip?: number,
    top?: number,
  ): Promise<IProjectTeam[]> {
    const params = getParamQuery(PROJECT_TEAMS_LIST_FIELDS, skip, top);
    const response = await this.setGetQueryYoutrack<IQueryProjectTeam>(
      '/projectteams',
      {
        headers: this.headers,
        params: params,
      },
    );
    if (response) {
      return response.projecteams;
    }
  }

  private async setGetQueryYoutrack<T>(
    url: string,
    config: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response = await this.hubHTTP.get(url, config).toPromise();
      return response.data;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
