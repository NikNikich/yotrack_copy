import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandService } from 'nestjs-command';
import { YoutrackService } from '../youtrack/youtrack.service';
import { HubService } from '../hub/hub.service';
import { SpreadSheetService } from '../spread-sheet/spread-sheet.service';

@Injectable()
export class GetDataCommands {
  private readonly logger: Logger = new Logger(GetDataCommands.name);

  constructor(
    private readonly hubService: HubService,
    private readonly youtrackService: YoutrackService,
    private readonly commandService: CommandService,
    private readonly spreadSheetService: SpreadSheetService,
  ) {}

  @Command({
    command: 'get:data',
    autoExit: false,
  })
  async getData() {
    this.logger.log('start filling the table with data');
    /* await this.youtrackService.addNewUsers();
    await this.youtrackService.addNewProjects();
    await this.youtrackService.addNewIssues();
    await this.hubService.addNewProjectTeams();
    await this.spreadSheetService.updateProjectInfo();
    await this.youtrackService.updateNullProjectIssues();*/
    await this.spreadSheetService.updateProjectInfo();
    this.commandService.exit(0);
  }
}
