import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { CommandsModule } from './cli/commands.module';
import { ConfigModule } from './config/config.module';
import { YoutrackSdkModule } from './youtrack_sdk/youtrack-sdk.module';
import { YoutrackModule } from './youtrack/youtrack.module';
import { SpreadSheetModule } from './spread-sheet/spread-sheet.module';
import { HubModule } from './hub/hub.module';
import { HttpYoutrackModule } from './http-youtrack/http-youtrack.module';
import { HttpHubModule } from './http-hub/http-hub.module';

@Module({
  imports: [
    ConfigModule.register(process.cwd() + '/.env'),
    CommandsModule,
    DatabaseModule,
    YoutrackSdkModule,
    YoutrackModule,
    HubModule,
    SpreadSheetModule,
    HttpYoutrackModule,
    HttpHubModule
  ],
})
export class CliMainModule {
}
