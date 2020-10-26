import { CommandModule, CommandService } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.command';
import { ObserverModule } from '../observer/observer.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { HttpYoutrackModule } from '../http-youtrack/http-youtrack.module';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';

@Module({
  imports: [
    YoutrackSdkModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL
      }),
      inject: [ConfigService],
    }),
      SpreadSheetModule,
    ConfigModule,
    YoutrackModule,
    CommandModule,
    HubModule,
    HttpYoutrackModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.config.HUB_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GetDataCommands],
})
export class CommandsModule {
}
