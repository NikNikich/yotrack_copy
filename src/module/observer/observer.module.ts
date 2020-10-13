import { Module } from '@nestjs/common';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ObserverScheduleService } from './observer-schedule-service';
import { ConfigService } from '../config/config.service';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub-youtrack/hub.module';
import { HubService } from '../hub-youtrack/hub.service';

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
  providers: [ObserverScheduleService],
  exports: [ObserverScheduleService]
})
export class ObserverModule {
}