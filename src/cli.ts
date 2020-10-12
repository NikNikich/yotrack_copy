import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CliMainModule } from './module/cli-main.module';
import { AppModule } from './module/app.module';


/**
 * Запускает модуль консольного интерфейса
 */

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false // no logger
  });
  app.select(CommandModule).get(CommandService).exec();
})();