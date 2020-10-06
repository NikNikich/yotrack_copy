import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack_sdk.module';
import { ConfigModule } from '../config/config.module';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { YoutrackService } from './youtrack.service';

@Module({
  imports: [
    YoutrackSdkModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService):  Promise<YoutrackTokenOptions> => {
        const {
          YOUTRACK_BASE_URL,
          YOUTRACK_TOKEN
        } = configService.config;
        return {
          baseUrl:  YOUTRACK_BASE_URL,
          token: YOUTRACK_TOKEN
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [YoutrackService],
  exports: [YoutrackService]
})
export class YoutrackModule {

}
