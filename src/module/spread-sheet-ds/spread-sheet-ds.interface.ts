import { ISheetInformation } from '../spread-sheet/spreed-sheet.interface';

export interface ISpreadSheetDS {
  getSheetInfo(): Promise<ISheetInformation[]>;
}
