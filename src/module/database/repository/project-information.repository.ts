import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ProjectInformationEntity } from '../entity/project-information.entity';

@EntityRepository(ProjectInformationEntity)
export class ProjectInformationRepository extends BaseRepository<ProjectInformationEntity> {
}