import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpHubModule } from '../http-hub/http-hub.module';
import { UserRepository } from '../database/repository/user.repository';
import { ProjectRepository } from '../database/repository/project.repository';
import { ProjectTeamRepository } from '../database/repository/project-team.repository';

@Module({
  imports: [
    HttpHubModule.forRootAsync(),
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
