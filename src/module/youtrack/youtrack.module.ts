import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ConfigModule } from '../config/config.module';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { YoutrackService } from './youtrack.service';

@Module({
  imports: [
    YoutrackSdkModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService):  Promise<YoutrackTokenOptions> => {
        return {
          baseUrl:  configService.config.YOUTRACK_BASE_URL,
          token: configService.config.YOUTRACK_TOKEN
        }
      },
      inject: [ConfigService]
    }),
  ],
  providers: [YoutrackService],
  exports: [YoutrackService]
})
export class YoutrackModule {

}
