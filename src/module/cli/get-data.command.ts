import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandService } from 'nestjs-command';
import { ObserverScheduleService } from '../observer/observer-schedule.service';
import { YoutrackService } from '../youtrack/youtrack.service';
import { ConfigService } from '../config/config.service';
import { HubService } from '../hub/hub.service';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';
import { SpreadSheetService } from '../spread-sheet/spread-sheet.service';
import { Youtrack } from 'youtrack-rest-client';

@Injectable()
export class GetDataCommands {
  private readonly logger: Logger = new Logger(GetDataCommands.name);
  constructor(
    private readonly hubService: HubService,
    private readonly youtrackService: YoutrackService,
    private readonly commandService: CommandService,
    private readonly spreadSheetService: SpreadSheetService,
    private readonly configService: ConfigService,
    private readonly youtrackClient: Youtrack,
  ) {}

  @Command({
    command: 'get:data',
    autoExit: false,
  })
  async getData() {
    this.logger.log('start filling the table with data');
    await this.youtrackService.addNewUsers();
    await this.youtrackService.addNewProjects();
    await this.youtrackService.updateIssues();
    //await this.youtrackService.addNewIssues();
    await this.hubService.addNewProjectTeams();
    // await this.spreadSheetService.updateProjectInfo();
    // await this.youtrackService.updateNullProjectIssues()
    this.commandService.exit(0);
  }
}
