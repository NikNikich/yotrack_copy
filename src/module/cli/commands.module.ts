import { CommandModule, CommandService } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub-youtrack/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.command';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ConfigService } from '../config/config.service';
import { ObserverModule } from '../observer/observer.module';
import { ObserverScheduleService } from '../observer/observer-schedule-service';

@Module({
  imports: [
    YoutrackModule,
    CommandModule,
    HubModule,
    ObserverModule,
  ],
  providers: [GetDataCommands],
})
export class CommandsModule {}
