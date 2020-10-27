export interface IGoogleExcelOptionsFactory {
  createGoogleExcelOptions():
    | Promise<IGoogleExcelOptions>
    | IGoogleExcelOptions;
}

export interface IGoogleExcelOptions {
  sheetId: string;
  useApiKey: string;
}
