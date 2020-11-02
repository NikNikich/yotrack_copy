import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { DirectionEntity } from '../entity/direction.entity';
import { ProjectEntity } from '../entity/project.entity';

@EntityRepository(DirectionEntity)
export class DirectionRepository extends BaseRepository<DirectionEntity> {
  async getIdFoundedByYoutrackIdOrCreated(
    name: string,
    youtrackId: string,
  ): Promise<number> {
    let direction = await this.findOne({ where: { youtrackId } });
    if (!direction) {
      direction = await this.save(
        new ProjectEntity({
          name,
          youtrackId,
        }),
      );
    }
    return direction.id;
  }
}
