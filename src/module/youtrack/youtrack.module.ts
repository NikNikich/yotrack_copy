import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { YoutrackSdkModule } from '../youtrack_sdk/youtrack-sdk.module';
import { ConfigModule } from '../config/config.module';
import { YoutrackTokenOptions } from 'youtrack-rest-client/dist/options/youtrack_options';
import { YoutrackService } from './youtrack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { DirectionEntity } from '../database/entity/direction.entity';
import { ProjectEntity } from '../database/entity/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DirectionEntity,
      ProjectEntity
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.config.YOUTRACK_BASE_URL+'/api'
      }),
      inject: [ConfigService],
    }),
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
