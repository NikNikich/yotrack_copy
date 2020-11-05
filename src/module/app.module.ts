import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { YoutrackSdkModule } from './youtrack_sdk/youtrack-sdk.module';
import { YoutrackModule } from './youtrack/youtrack.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommandModule } from 'nestjs-command';
import { CommandsModule } from './cli/commands.module';
import { HubModule } from './hub/hub.module';
import { HttpYoutrackModule } from './http-youtrack/http-youtrack.module';
import { SpreadSheetModule } from './spread-sheet/spread-sheet.module';
import { GoogleExcelModule } from './google-excel/google-excel.module';

@Module({
  imports: [
    CommandModule,
    CommandsModule,
    ScheduleModule.forRoot(),
    ConfigModule.register(process.cwd() + '/.env.local'),
    DatabaseModule,
    ObserverModule,
    HubModule,
    YoutrackSdkModule,
    YoutrackModule,
    HttpYoutrackModule,
    SpreadSheetModule,
    GoogleExcelModule,
  ],
})
export class AppModule {}
