import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { CommandsModule } from './cli/commands.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { YoutrackSdkModule } from './youtrack_sdk/youtrack-sdk.module';
import { YoutrackModule } from './youtrack/youtrack.module';
import { HubModule } from './hub-youtrack/hub.module';

@Module({
  imports: [
    ConfigModule.register('.env'),
    CommandsModule,
    DatabaseModule,
    YoutrackSdkModule,
    YoutrackModule,
    HubModule,
  ],
})
export class CliMainModule {}
