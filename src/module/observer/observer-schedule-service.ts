import { Injectable, Logger } from '@nestjs/common';
import { Youtrack } from 'youtrack-rest-client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ObserverScheduleService {
  private readonly logger = new Logger(ObserverScheduleService.name);

  constructor(
    private readonly youtrackClient: Youtrack,
  ) {
  }

  @Cron('*/1 * * * *')
  private async fetchDataFromYoutrack(): Promise<void> {
    this.logger.log('Start fetching data');
  //  const projects = await this.youtrackClient.issues.search("project: TR and updated: Today")
    const projects = await this.youtrackClient.issues.byId("2-19790")
    const direction = projects.fields.map((field)=>{
     if (field.name === 'Direction'){
       console.log(field.value);
       console.log(field.projectCustomField);
       return field;
     }
    });
  //  console.log(projects);
  }
}