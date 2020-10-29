import { resolve } from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const {
      TYPEORM_HOST,
      TYPEORM_USERNAME,
      TYPEORM_PASSWORD,
      TYPEORM_DATABASE,
      TYPEORM_PORT,
      TYPEORM_SYNCHRONIZE,
      TYPEORM_ENTITIES,
      TYPEORM_LOGGING,
    } = this.configService.config;
    return {
      type: 'postgres',
      host: TYPEORM_HOST,
      port: TYPEORM_PORT,
      username: TYPEORM_USERNAME,
      password: TYPEORM_PASSWORD,
      database: TYPEORM_DATABASE,
      entities: [`${resolve(__dirname, '..')}/**/*.entity{.ts,.js}`],
      migrationsRun: true,
      //  logging: TYPEORM_LOGGING ? true : 'all',
      cli: { migrationsDir: './migrations' },
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: TYPEORM_SYNCHRONIZE || true,
    };
  }
}
