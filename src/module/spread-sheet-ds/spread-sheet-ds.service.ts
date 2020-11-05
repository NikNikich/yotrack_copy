import { ISpreadSheetDS } from './spread-sheet-ds.interface';
import { ISheetInformation } from '../spread-sheet/spreed-sheet.interface';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { get, isNil } from 'lodash';
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
          return {
            direction: !isNil(get(row, SPREED_HEADERS.direction))
              ? get(row, SPREED_HEADERS.direction)
              : null,
            project: !isNil(get(row, SPREED_HEADERS.project))
              ? get(row, SPREED_HEADERS.project)
              : null,
            projectEstimation: !isNil(
              get(row, SPREED_HEADERS.projectEstimation),
            )
              ? get(row, SPREED_HEADERS.projectEstimation)
              : null,
            rate: !isNil(get(row, SPREED_HEADERS.rate))
              ? get(row, SPREED_HEADERS.rate)
              : null,
          };
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
