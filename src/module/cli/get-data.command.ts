import { Injectable } from '@nestjs/common';
import { Command, CommandService } from 'nestjs-command';
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
    private readonly commandService: CommandService,
  ) {}

  @Command({
    command: 'get:data',
    autoExit: false
  })
  async getData() {
    console.log('command');
    // const users= await this.youtrackClient.users.byId("1-31");
    /* const users= await this.youtrackService.getListUserHttp(10,50);
        console.log(users);
    console.log(users.length);*/
   /* const issue = await this.youtrackService.getListIssueHttp(10, 200);
    issue.map((issu) => {
      if (issu.parent.issues.length > 0) {
        console.log(issu);
        console.log(issu.parent.issues);
      }
    });*/
    // const projects = await this.youtrackClient.issues.search("project: TR and updated: Today")
    //  const projects = await this.youtrackClient.issues.byId('2-20432');
    //  const projects = await this.youtrackClient.projects.byId('0-11');
    /*projects.fields.map((field)=>{
       if (field.name === 'Estimation'){
         console.log(field.value);
         console.log(field.projectCustomField.field.fieldDefaults);
         console.log(field);
         return field;
       }
      });*/
    /*const projects= await this.youtrackService.getListProjectHttp(10,50);
    console.log(projects.length);*/
     // console.log(projects);
    /* const roles = await this.hubService.getListUser();
     console.log("roles");
     console.log(roles);*/
    //await this.youtrackService.addNewUsers();
    //   await this.youtrackService.addNewProjects();
    // await this.youtrackService.addNewIssues();
   // await this.youtrackService.updateUsers();
    await  this.hubService.addNewProjectTeams();
    this.commandService.exit(0);
  }
}
