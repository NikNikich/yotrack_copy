import {
  DynamicModule,
  HttpModule,
  HttpModuleOptions,
  Module,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { HttpModuleAsyncOptions } from '@nestjs/common/http/interfaces';
import { HubServiceDS } from './hub-ds.service';
import { HUB_DS_KEY } from './hub-ds.const';

@Module({})
export class HubModuleDS {
  static forRoot(options: HttpModuleOptions): DynamicModule {
    return {
      module: HubModuleDS,
      imports: [
        HttpModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            baseURL: options.baseURL || configService.config.HUB_BASE_URL,
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: HUB_DS_KEY,
          useClass: HubServiceDS,
        },
      ],
      exports: [HUB_DS_KEY],
    };
  }

  static forRootAsync(options?: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HubModuleDS,
      imports: [
        HttpModule.registerAsync(this.createConfigAsyncProviders(options)),
      ],
      providers: [
        {
          provide: HUB_DS_KEY,
          useClass: HubServiceDS,
        },
      ],
      exports: [HUB_DS_KEY],
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
          baseURL: configService.config.HUB_BASE_URL,
        }),
        inject: [ConfigService],
      };
    }
  }
}
