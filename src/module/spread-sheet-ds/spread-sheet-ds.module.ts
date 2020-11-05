import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { GoogleExcelModule } from '../google-excel/google-excel.module';
import { SpreadSheetServiceDS } from './spread-sheet-ds.service';
import { SPREAD_SHEET_DS_KEY } from './spread-sheet-ds.const';

@Module({
  imports: [
    GoogleExcelModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        useApiKey: configService.config.GOOGLE_API_KEY,
        sheetId: configService.config.GOOGLE_SHEET_ID,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: SPREAD_SHEET_DS_KEY,
      useValue: SpreadSheetServiceDS,
    },
    ConfigService,
  ],
  exports: [
    {
      provide: SPREAD_SHEET_DS_KEY,
      useValue: SpreadSheetServiceDS,
    },
  ],
})
export class SpreedSheetModuleDS {}
