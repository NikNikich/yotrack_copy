import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';

@Injectable()
export class GooglespreadsheetClient
  extends GoogleSpreadsheet
  implements OnApplicationBootstrap {
  async onApplicationBootstrap(): Promise<void> {
    //  await this.useApiKey()
  }
}
