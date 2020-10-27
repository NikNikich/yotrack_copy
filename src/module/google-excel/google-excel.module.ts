import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  IGoogleExcelOptions,
  IGoogleExcelOptionsFactory,
} from './interface/google-excel-options-factory';
import { GOOGLE_EXCEL_MODULE_OPTIONS } from './constant/google-excel.constant';
import { IGoogleExcelAsyncOptions } from './interface/google-excel-async-options.interface';

@Module({})
export class GoogleExcelModule {
  static forRoot(options: IGoogleExcelOptions): DynamicModule {
    return {
      module: GoogleExcelModule,
      providers: [...GoogleExcelModule.createGoogleExcelProvider(options)],
      exports: [GoogleSpreadsheet],
    };
  }

  static forRootAsync(options: IGoogleExcelAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: GoogleSpreadsheet,
      useFactory: async (
        googleExcelOptions: IGoogleExcelOptions,
      ): Promise<GoogleSpreadsheet> => {
        const googleSpreadsheet = new GoogleSpreadsheet(
          googleExcelOptions.sheetId,
        );
        await googleSpreadsheet.useApiKey(googleExcelOptions.useApiKey);
        return googleSpreadsheet;
      },
      inject: [GOOGLE_EXCEL_MODULE_OPTIONS],
    };
    return {
      module: GoogleExcelModule,
      imports: options.imports || [],
      providers: [this.createConfigAsyncProviders(options), connectionProvider],
      exports: [GoogleSpreadsheet],
    };
  }

  private static createGoogleExcelProvider(
    options: IGoogleExcelOptions,
  ): Provider[] {
    const googleSpreadsheet = new GoogleSpreadsheet(options.sheetId);
    return [
      {
        provide: GOOGLE_EXCEL_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: GoogleSpreadsheet,
        useValue: googleSpreadsheet,
      },
    ];
  }

  private static createConfigAsyncProviders(
    options: IGoogleExcelAsyncOptions,
  ): Provider {
    if (options) {
      if (options.useFactory) {
        return {
          provide: GOOGLE_EXCEL_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      } else {
        // For useClass and useExisting...
        return {
          provide: GOOGLE_EXCEL_MODULE_OPTIONS,
          useFactory: async (
            optionsFactory: IGoogleExcelOptionsFactory,
          ): Promise<IGoogleExcelOptions> =>
            await optionsFactory.createGoogleExcelOptions(),
          inject: [options.useExisting || options.useClass],
        };
      }
    } else {
      return {
        provide: GOOGLE_EXCEL_MODULE_OPTIONS,
        useValue: {},
      };
    }
  }
}
