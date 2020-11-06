import { HttpService, Injectable, Logger } from '@nestjs/common';
import { IProjectTeam } from '../hub/hub.interface';
import { getParamQuery } from '../shared/http.function';
import { ConfigService } from '../config/config.service';
import { PROJECT_TEAMS_LIST_FIELDS } from './hub-ds.const';
import { IHubDS, IQueryProjectTeam } from './hub-ds.interface';

@Injectable()
export class HubServiceDS implements IHubDS {
  private readonly headers = {
    Authorization: 'Bearer ' + this.configService.config.HUB_TOKEN,
  };
  private readonly logger: Logger = new Logger(HubServiceDS.name);

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
      return response.projectteams;
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
