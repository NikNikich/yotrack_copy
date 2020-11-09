import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { YoutrackService } from '../youtrack/youtrack.service';
import { HubService } from '../hub/hub.service';
import { SpreadSheetService } from '../spread-sheet/spread-sheet.service';

@Injectable()
export class ObserverScheduleService {
  private readonly logger = new Logger(ObserverScheduleService.name);

  constructor(
    private readonly youtrackService: YoutrackService,
    private readonly hubService: HubService,
    private readonly spreadSheetService: SpreadSheetService,
  ) {}

  @Cron('10 00 * * *')
  public async fetchDataFromYoutrack(): Promise<void> {
    this.logger.log('Start fetching data');
    await this.youtrackService.updateNullProjectIssues();
    await this.youtrackService.addNewUsers();
    await this.youtrackService.addNewProjects();
    await this.youtrackService.updateIssues();
    await this.hubService.addNewProjectTeams();
    await this.spreadSheetService.updateProjectInfo();
  }
}
