import { Module } from '@nestjs/common';
import { ObserverScheduleService } from './observer-schedule.service';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { HubModule } from '../hub/hub.module';
import { SpreadSheetModule } from '../spread-sheet/spread-sheet.module';

@Module({
  imports: [YoutrackModule, HubModule, SpreadSheetModule],
  providers: [ObserverScheduleService],
  exports: [ObserverScheduleService],
})
export class ObserverModule {}
