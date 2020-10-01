import { DynamicModule, Module, Provider } from '@nestjs/common';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { Youtrack } from 'youtrack-rest-client';
import { YoutrackModuleAsyncOptions } from './interface/youtrack-module-async-options';
import { YOUTRACK_MODULE_OPTIONS } from './constant/youtrack.constant';
import { YoutrackOptionsFactory } from './interface/youtrack-options-factory';

@Module({})
export class YoutrackModule {
  static forRoot(options: YoutrackTokenOptions): DynamicModule {
    return {
      module: YoutrackModule,
      providers: [
        ...YoutrackModule.createYoutrackProvider(options),
      ],
      exports: [Youtrack],
    };
  }

  static forRootAsync(options: YoutrackModuleAsyncOptions): DynamicModule {
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
      module: YoutrackModule,
      imports: options.imports || [],
      providers: [
        this.createConfigAsyncProviders(options),
        connectionProvider,
      ],
      exports: [Youtrack],
    };
  }

  private static createYoutrackProvider(
    options: YoutrackTokenOptions,
  ): Provider[] {
    return [
      {
        provide: YOUTRACK_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: Youtrack,
        useValue: new Youtrack(options),
      },
    ];
  }

  private static createConfigAsyncProviders(
    options: YoutrackModuleAsyncOptions,
  ): Provider {
    if (options) {
      if (options.useFactory) {
        return {
          provide: YOUTRACK_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      } else {
        // For useClass and useExisting...
        return {
          provide: YOUTRACK_MODULE_OPTIONS,
          useFactory: async (optionsFactory: YoutrackOptionsFactory): Promise<YoutrackTokenOptions> =>
            await optionsFactory.createYoutrackOptions(),
          inject: [options.useExisting || options.useClass],
        };
      }
    } else {
      return {
        provide: YOUTRACK_MODULE_OPTIONS,
        useValue: {},
      };
    }
  }
}