import { Module } from '@nestjs/common';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack_sdk.module';
import { ObserverScheduleService } from './observer-schedule-service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    YoutrackSdkModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ObserverScheduleService],
})
export class ObserverModule {
}