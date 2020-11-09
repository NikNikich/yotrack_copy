import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from '../database/repository/project.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { SpreadSheetService } from './spread-sheet.service';
import { ConfigService } from '../config/config.service';
import { GoogleExcelModule } from '../google-excel/google-excel.module';
import { SpreedSheetModuleDS } from '../spread-sheet-ds/spread-sheet-ds.module';

@Module({
  imports: [
    GoogleExcelModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        useApiKey: configService.config.GOOGLE_API_KEY,
        sheetId: configService.config.GOOGLE_SHEET_ID,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      DirectionRepository,
      ProjectRepository,
      ProjectInformationRepository,
    ]),
    SpreedSheetModuleDS,
  ],
  providers: [ConfigService, SpreadSheetService],
  exports: [SpreadSheetService],
})
export class SpreadSheetModule {}
