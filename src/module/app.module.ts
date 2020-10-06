import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { YoutrackSdkModule } from './youtrack_sdk/youtrack_sdk.module';
import { YoutrackModule } from './youtrack/youtrack.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.register('.env'),
    ObserverModule,
    DatabaseModule,
    YoutrackSdkModule,
    YoutrackModule
  ],
})
export class AppModule {
}
