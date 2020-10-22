import { DynamicModule, HttpModule, HttpModuleOptions, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { HttpYoutrackService } from '../http-youtrack/http-youtrack.service';
import { HttpModuleAsyncOptions } from '@nestjs/common/http/interfaces';
import { HttpHubService } from './http-hub.service';

@Module({})
export class HttpHubModule {
  static forRoot(options: HttpModuleOptions): DynamicModule {
    return {
      module: HttpHubModule,
      imports: [HttpModule.registerAsync({
        useFactory: async (configService: ConfigService) => ({
          baseURL: options.baseURL || configService.config.HUB_BASE_URL,
        }),
        inject: [ConfigService],
      })],
      providers: [HttpHubService],
      exports: [HttpHubService],
    };
  }

  static forRootAsync(options?: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpHubModule,
      imports: [HttpModule.registerAsync(this.createConfigAsyncProviders(options))],
      providers: [HttpHubService],
      exports: [HttpHubService],
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
          baseURL: configService.config.HUB_BASE_URL,
        }),
        inject: [ConfigService],
      };
    }
  }
}