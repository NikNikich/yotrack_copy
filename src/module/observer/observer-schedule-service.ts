import { Injectable, Logger } from '@nestjs/common';
import { Youtrack } from 'youtrack-rest-client';
import { Cron } from '@nestjs/schedule';
import { YoutrackService } from '../youtrack/youtrack.service';
import { HubService } from '../hub-youtrack/hub.service';

@Injectable()
export class ObserverScheduleService {
  private readonly logger = new Logger(ObserverScheduleService.name);

  constructor(
    private readonly youtrackService: YoutrackService,
    private readonly hubService: HubService,
    private readonly youtrackClient: Youtrack,
  ) {
  }

  @Cron('*/1 * * * *')
  public async fetchDataFromYoutrack(): Promise<void> {
    this.logger.log('Start fetching data');
    /*const users= await this.youtrackClient.users.byId("1-31");
    console.log(users);*/
   // const projects = await this.youtrackClient.issues.search("project: TR and updated: Today")
    const projects = await this.youtrackClient.issues.byId('2-18113');
 //  const projects = await this.youtrackClient.projects.byId('0-11');
  /*projects.fields.map((field)=>{
     if (field.name === 'Direction'){
       console.log(field.value);
       console.log(field.projectCustomField);
       return field;
     }
    });*/
    console.log(projects);
   /* const roles = await this.hubService.getListUser();
    console.log("roles");
    console.log(roles);*/
  }
}