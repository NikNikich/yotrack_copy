import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { HubService } from './hub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../database/entity/user.entity';
import { DirectionEntity } from '../database/entity/direction.entity';
import { ProjectEntity } from '../database/entity/project.entity';
import { ItemEntity } from '../database/entity/item.entity';
import { ProjectTeamEntity } from '../database/entity/projectTeam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectTeamEntity]),
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
export class HubModule {
}
