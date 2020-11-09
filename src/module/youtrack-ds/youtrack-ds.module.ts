import {
  DynamicModule,
  HttpModule,
  HttpModuleOptions,
  Module,
} from '@nestjs/common';
import { YoutrackServiceDS } from './youtrack-ds.service';
import { HttpModuleAsyncOptions } from '@nestjs/common/http/interfaces';
import { ConfigService } from '../config/config.service';
import { YOUTRACK_DS_KEY } from './youtrack-ds.const';

@Module({})
export class YoutrackModuleDS {
  static forRoot(options: HttpModuleOptions): DynamicModule {
    return {
      module: YoutrackModuleDS,
      imports: [
        HttpModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            baseURL:
              options.baseURL ||
              configService.config.YOUTRACK_BASE_URL + '/api',
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: YOUTRACK_DS_KEY,
          useClass: YoutrackServiceDS,
        },
      ],
      exports: [YOUTRACK_DS_KEY],
    };
  }

  static forRootAsync(options?: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: YoutrackModuleDS,
      imports: [
        HttpModule.registerAsync(this.createConfigAsyncProviders(options)),
      ],
      providers: [
        {
          provide: YOUTRACK_DS_KEY,
          useClass: YoutrackServiceDS,
        },
      ],
      exports: [YOUTRACK_DS_KEY],
    };
  }

  private static createConfigAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): HttpModuleAsyncOptions {
    if (options) {
      if (options.useFactory) {
        return {
          useFactory: options.useFactory,
          inject: [ConfigService],
        };
      } else {
        options.inject.push(ConfigService);
        return options;
      }
    } else {
      return {
        useFactory: async (configService: ConfigService) => ({
          baseURL: configService.config.YOUTRACK_BASE_URL + '/api',
        }),
        inject: [ConfigService],
      };
    }
  }
}
