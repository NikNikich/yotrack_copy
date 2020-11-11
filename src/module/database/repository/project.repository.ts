import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ProjectEntity } from '../entity/project.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  async findByYoutrackIdOrCreateNew(
    youtrackId: string,
  ): Promise<ProjectEntity> {
    let project = await this.findOne({ where: { youtrackId } });
    if (!project) {
      project = new ProjectEntity({
        youtrackId,
      });
    }
    return project;
  }

  async getIdFoundedByYoutrackIdOrCreated(
    name: string,
    youtrackId: string,
    hubResourceId: string,
  ): Promise<number> {
    let project = await this.findOne({ where: { youtrackId } });
    if (!project) {
      project = await this.save(
        new ProjectEntity({
          hubResourceId,
          name,
          youtrackId,
        }),
      );
    }
    return project.id;
  }

  async isCommercial(id?: number): Promise<void> {
    if (id) {
      const project = await this.findOne(id);
      if (project && !project.isCommercial) {
        project.isCommercial = true;
        await this.save(project);
      }
    }
  }
}
