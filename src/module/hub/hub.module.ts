import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';
import { HubModuleDS } from '../hub-ds/hub-ds.module';

@Module({
  imports: [
    HubModuleDS.forRootAsync(),
    TypeOrmModule.forFeature([
      UserRepository,
      ProjectRepository,
      ProjectTeamRepository,
    ]),
  ],
  providers: [HubService],
  exports: [HubService],
})
export class HubModule {}
