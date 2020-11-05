import { Module } from '@nestjs/common';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ObserverScheduleService } from './observer-schedule.service';
import { ConfigService } from '../config/config.service';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub/hub.module';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';

@Module({
  imports: [
    YoutrackModule,
    HubModule,
    SpreadSheetModule,
    YoutrackSdkModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ObserverScheduleService],
  exports: [ObserverScheduleService],
})
export class ObserverModule {}
