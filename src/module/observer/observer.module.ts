import { Module } from '@nestjs/common';
import { YoutrackModule } from '../youtrack/youtrack.module';
import { ObserverService } from './observer-service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    YoutrackModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.config.YOUTRACK_TOKEN,
        baseUrl: configService.config.YOUTRACK_BASE_URL
      }),
      inject: [ConfigService],
    })
  ],
  providers: [ObserverService]
})
export class ObserverModule {
}