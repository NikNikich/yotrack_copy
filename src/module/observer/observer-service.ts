import { Injectable, Logger } from '@nestjs/common';
import { Youtrack } from 'youtrack-rest-client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ObserverService {
  private readonly logger = new Logger(ObserverService.name);

  constructor(
    private readonly youtrackClient: Youtrack,
  ) {
  }

  @Cron('*/1 * * * *')
  private async fetchDataFromYoutrack(): Promise<void> {
    this.logger.log('Start fetching data');
    const projects = await this.youtrackClient.projects.all();
    console.log(projects)
  }
}