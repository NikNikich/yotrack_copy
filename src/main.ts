import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { Logger } from '@nestjs/common';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository
} from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger(bootstrap.name);
  logger.log('Server was started');
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
}

bootstrap();
