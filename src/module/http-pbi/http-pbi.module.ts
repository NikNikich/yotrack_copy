import { DynamicModule, HttpModuleOptions, Module, Provider } from '@nestjs/common';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { Youtrack } from 'youtrack-rest-client';
import { YoutrackModuleAsyncOptions } from '../youtrack_sdk/interface/youtrack-module-async-options';
import { YOUTRACK_MODULE_OPTIONS } from '../youtrack_sdk/constant/youtrack.constant';
import { YoutrackOptionsFactory } from '../youtrack_sdk/interface/youtrack-options-factory';
import { HttpPbiService } from './http-pbi.service';
import { HttpModuleAsyncOptions } from '@nestjs/common/http/interfaces';
import { HTTP_PBI_MODULE_OPTIONS } from './constant/http-pbi-constant';

@Module({})
export class HttpPbiModule {
  static forRoot(options: HttpModuleOptions): DynamicModule {
    return {
      module: HttpPbiModule,
      providers: [...HttpPbiModule.createHttpPbiProvider(options)],
      exports: [HttpPbiService],
    };
  }

  static forRootAsync(options: HttpModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: Youtrack,
      useFactory: async (
        youtrackModuleOption: YoutrackTokenOptions,
      ): Promise<Youtrack> => {
        return new Youtrack(youtrackModuleOption);
      },
      inject: [YOUTRACK_MODULE_OPTIONS],
    };
    return {
      module: HttpPbiModule,
      imports: options.imports || [],
      providers: [this.createConfigAsyncProviders(options), connectionProvider],
      exports: [HttpPbiService],
    };
  }

  private static createHttpPbiProvider(
    options: HttpModuleOptions,
  ): Provider[] {
    return [
      {
        provide: HTTP_PBI_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: Youtrack,
        useValue: new Youtrack(options),
      },
    ];
  }

  private static createConfigAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): Provider {
    if (options) {
      if (options.useFactory) {
        return {
          provide: HTTP_PBI_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      } else {
        // For useClass and useExisting...
        return {
          provide: HTTP_PBI_MODULE_OPTIONS,
          useFactory: async (
            optionsFactory: YoutrackOptionsFactory,
          ): Promise<YoutrackTokenOptions> =>
            await optionsFactory.createYoutrackOptions(),
          inject: [options.useExisting || options.useClass],
        };
      }
    } else {
      return {
        provide: HTTP_PBI_MODULE_OPTIONS,
        useValue: {},
      };
    }
  }
}