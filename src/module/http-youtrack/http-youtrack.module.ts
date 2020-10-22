import { DynamicModule, HttpModule, HttpModuleOptions, Module } from '@nestjs/common';
import { HttpYoutrackService } from './http-youtrack.service';
import { HttpModuleAsyncOptions } from '@nestjs/common/http/interfaces';
import { ConfigService } from '../config/config.service';

@Module({})
export class HttpYoutrackModule {
  static forRoot(options: HttpModuleOptions): DynamicModule {
    return {
      module: HttpYoutrackModule,
      imports: [HttpModule.registerAsync({
        useFactory: async (configService: ConfigService) => ({
          baseURL: options.baseURL || (configService.config.YOUTRACK_BASE_URL + '/api'),
        }),
        inject: [ConfigService],
      })],
      providers: [HttpYoutrackService],
      exports: [HttpYoutrackService],
    };
  }

  static forRootAsync(options?: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpYoutrackModule,
      imports: [HttpModule.registerAsync(this.createConfigAsyncProviders(options))],
      providers: [HttpYoutrackService],
      exports: [HttpYoutrackService],
    };
  }

  private static createConfigAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): HttpModuleAsyncOptions {
    if (options && options.useFactory) {
      return {
        useFactory: options.useFactory,
        inject: [ConfigService],
      };
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