import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { YoutrackService } from './youtrack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpYoutrackModule } from '../http-youtrack/http-youtrack.module';
import { UserRepository } from '../database/repository/user.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ItemRepository } from '../database/repository/item.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, DirectionRepository, ProjectRepository, ItemRepository]),
    HttpYoutrackModule.forRootAsync(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.config.YOUTRACK_BASE_URL + '/api',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [YoutrackService],
  exports: [YoutrackService],
})
export class YoutrackModule {
}
