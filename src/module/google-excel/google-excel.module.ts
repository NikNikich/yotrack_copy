import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  IGoogleExcelOptions,
  IGoogleExcelOptionsFactory,
} from './interface/google-excel-options-factory';
import { GOOGLE_EXCEL_MODULE_OPTIONS } from './constant/google-excel.constant';
import { IGoogleExcelAsyncOptions } from './interface/google-excel-async-options.interface';
import { GoogleExcelClient } from './google-excel.client';

@Module({})
export class GoogleExcelModule {
  static forRoot(options: IGoogleExcelOptions): DynamicModule {
    return {
      module: GoogleExcelModule,
      providers: [...GoogleExcelModule.createGoogleExcelProvider(options)],
      exports: [GoogleExcelClient],
    };
  }

  static forRootAsync(options: IGoogleExcelAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: GoogleExcelClient,
      useFactory: async (
        googleExcelOptions: IGoogleExcelOptions,
      ): Promise<GoogleExcelClient> => {
        return new GoogleExcelClient(googleExcelOptions);
      },
      inject: [GOOGLE_EXCEL_MODULE_OPTIONS],
    };
    return {
      module: GoogleExcelModule,
      imports: options.imports || [],
      providers: [this.createConfigAsyncProviders(options), connectionProvider],
      exports: [GoogleExcelClient],
    };
  }

  private static createGoogleExcelProvider(
    options: IGoogleExcelOptions,
  ): Provider[] {
    return [
      {
        provide: GOOGLE_EXCEL_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: GoogleExcelClient,
        useValue: new GoogleExcelClient(options),
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
