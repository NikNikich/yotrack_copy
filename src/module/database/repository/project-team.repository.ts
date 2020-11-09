import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ProjectTeamEntity } from '../entity/project-team.entity';

@EntityRepository(ProjectTeamEntity)
export class ProjectTeamRepository extends BaseRepository<ProjectTeamEntity> {
  async findByHubIdOrCreateNew(hubId: string): Promise<ProjectTeamEntity> {
    let projectTeam = await this.findOne({
      where: { hubId },
      relations: ['users'],
    });
    if (!projectTeam) {
      projectTeam = new ProjectTeamEntity();
      projectTeam.hubId = hubId;
    }
    return projectTeam;
  }
}
