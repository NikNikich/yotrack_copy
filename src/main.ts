import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Youtrack } from 'youtrack-rest-client';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);

  const config = {
    baseUrl: "https://ytr.omega-r.club",
    token: "perm:your-token"
  };
  const youtrack = new Youtrack(config);
  const project = await youtrack.workItems.all('');
}
bootstrap();
