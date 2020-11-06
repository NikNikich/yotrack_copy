import { ISpreadSheetDS } from './spread-sheet-ds.interface';
import { ISheetInformation } from '../spread-sheet/spreed-sheet.interface';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { get } from 'lodash';
import { SPREED_HEADERS } from '../spread-sheet/spreed-sheet.const';
import { GoogleExcelClient } from '../google-excel/google-excel.client';
import { ConfigService } from '../config/config.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SpreadSheetServiceDS implements ISpreadSheetDS {
  private readonly logger = new Logger(SpreadSheetServiceDS.name);

  constructor(
    private readonly googleExcelClient: GoogleExcelClient,
    private readonly configService: ConfigService,
  ) {}

  async getSheetInfo(): Promise<ISheetInformation[]> {
    await this.googleExcelClient.useApiKey(
      this.configService.config.GOOGLE_API_KEY,
    );
    try {
      await this.googleExcelClient.loadInfo();
      const sheet = this.googleExcelClient.sheetsByIndex[0];
      const rows = await sheet.getRows();
      return rows.map(
        (row: GoogleSpreadsheetRow): ISheetInformation => {
          const directionValue = get(row, SPREED_HEADERS.direction);
          const projectValue = get(row, SPREED_HEADERS.project);
          const projectEstimationValue = get(
            row,
            SPREED_HEADERS.projectEstimation,
          );
          const rateValue = get(row, SPREED_HEADERS.rate);
          return {
            direction: directionValue || null,
            project: projectValue || null,
            projectEstimation: projectEstimationValue || null,
            rate: rateValue || null,
          };
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
