import { CommandModule } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.command';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';

@Module({
  imports: [
    YoutrackSdkModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL,
      }),
      inject: [ConfigService],
    }),
    SpreadSheetModule,
    ConfigModule,
    YoutrackModule,
    CommandModule,
    HubModule,
  ],
  providers: [GetDataCommands],
})
export class CommandsModule {}
