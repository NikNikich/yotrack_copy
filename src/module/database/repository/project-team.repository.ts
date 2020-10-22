import { EntityRepository } from 'typeorm';
import {BaseRepository} from 'typeorm-transactional-cls-hooked';
import { ProjectTeamEntity } from '../entity/project-team.entity';

@EntityRepository(ProjectTeamEntity)
export class ProjectTeamRepository extends BaseRepository<ProjectTeamEntity> {
}
