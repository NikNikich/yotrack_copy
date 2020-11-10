import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { YoutrackModule } from './youtrack/youtrack.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommandModule } from 'nestjs-command';
import { CommandsModule } from './cli/commands.module';
import { HubModule } from './hub/hub.module';
import { SpreadSheetModule } from './spread-sheet/spread-sheet.module';
import { GoogleExcelModule } from './google-excel/google-excel.module';
import { SpreedSheetModuleDS } from './spread-sheet-ds/spread-sheet-ds.module';
import { YoutrackModuleDS } from './youtrack-ds/youtrack-ds.module';
import { HubModuleDS } from './hub-ds/hub-ds.module';

const envName = process.env.NODE_ENV
  ? `/.env.${process.env.NODE_ENV}`
  : '/.env';

@Module({
  imports: [
    CommandModule,
    CommandsModule,
    ScheduleModule.forRoot(),
    ConfigModule.register(process.cwd() + envName),
    DatabaseModule,
    ObserverModule,
    HubModule,
    YoutrackModule,
    YoutrackModuleDS,
    SpreadSheetModule,
    SpreedSheetModuleDS,
    GoogleExcelModule,
    HubModuleDS,
  ],
})
export class AppModule {}
