import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { HubService } from './hub.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.config.HUB_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HubService],
  exports: [HubService],
})
export class HubModule {}
