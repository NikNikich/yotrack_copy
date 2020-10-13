import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { HubService } from '../hub-youtrack/hub.service';
import { Youtrack } from 'youtrack-rest-client';
import { ObserverScheduleService } from '../observer/observer-schedule-service';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { YoutrackService } from '../youtrack/youtrack.service';

@Injectable()
export class GetDataCommands {
  constructor(
    private readonly observerService: ObserverScheduleService,
    private readonly hubService: HubService,
    private readonly youtrackClient: Youtrack,
    private readonly youtrackService: YoutrackService,
  ) {
  }

  @Command({
    command: 'get:data',
  })
  async getData() {
    console.log("command");
    // const users= await this.youtrackClient.users.byId("1-31");
    /*const users= await this.youtrackService.getListUserHttp(10,50);
        console.log(users);
    console.log(users.length);*/
    // const projects = await this.youtrackClient.issues.search("project: TR and updated: Today")
    // const projects = await this.youtrackClient.issues.byId('2-18113');
     const projects = await this.youtrackClient.projects.byId('0-11');
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