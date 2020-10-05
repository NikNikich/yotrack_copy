import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
  //  ConfigModule.register(process.cwd() + '/.env'),
     ConfigModule.register('.env'),
    ObserverModule,
    DatabaseModule
  ],
})
export class AppModule {
}
