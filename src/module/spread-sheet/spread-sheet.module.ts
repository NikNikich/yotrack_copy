import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from '../database/repository/project.repository';
import { DirectionRepository } from '../database/repository/direction.repository';
import { ProjectInformationRepository } from '../database/repository/project-information.repository';
import { SpreadSheetService } from './spread-sheet.service';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([DirectionRepository, ProjectRepository, ProjectInformationRepository]),
  ],
  providers: [SpreadSheetService],
  exports: [SpreadSheetService],
})
export class SpreadSheetModule {
}