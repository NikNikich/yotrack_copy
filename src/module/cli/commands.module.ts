import { CommandModule } from 'nestjs-command';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub-youtrack/hub.module';
import { Module } from '@nestjs/common';
import { GetDataCommands } from './get-data.coomand';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    YoutrackModule,
    HubModule,
    YoutrackSdkModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GetDataCommands],
})
export class CommandsModule {

}