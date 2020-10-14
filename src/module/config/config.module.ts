import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_MODULE_PATH } from './constant/config.constant';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(path?: string): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_MODULE_PATH,
          useValue: path || '.env',
        },
        {
          provide: ConfigService,
          useValue: new ConfigService(path),
        },
      ],
      exports: [CONFIG_MODULE_PATH, ConfigService],
    };
  }
}
