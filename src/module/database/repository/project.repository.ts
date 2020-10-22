import { EntityRepository } from 'typeorm';
import {BaseRepository} from 'typeorm-transactional-cls-hooked';
import { ProjectEntity } from '../entity/project.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends BaseRepository<ProjectEntity> {
}
