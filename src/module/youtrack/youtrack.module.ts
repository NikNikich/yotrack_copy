import { Module } from '@nestjs/common';
import { YoutrackService } from './youtrack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../database/repository/user.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ItemRepository } from '../database/repository/item.repository';
import { TimeTrackingRepository } from '../database/repository/time-tracking.repository';
import { YoutrackModuleDS } from '../youtrack-ds/youtrack-ds.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      DirectionRepository,
      ProjectRepository,
      ItemRepository,
      TimeTrackingRepository,
    ]),
    YoutrackModuleDS.forRootAsync(),
  ],
  providers: [YoutrackService],
  exports: [YoutrackService],
})
export class YoutrackModule {}
