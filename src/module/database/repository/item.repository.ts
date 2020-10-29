import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ItemEntity } from '../entity/item.entity';

@EntityRepository(ItemEntity)
export class ItemRepository extends BaseRepository<ItemEntity> {
  async findByIdOrCreateNew(id: number): Promise<ItemEntity> {
    let item = await this.findOne(id);
    if (!item) {
      item = new ItemEntity();
    }
    return item;
  }

  async findByYoutrackIdOrCreateNew(youtrackId: string): Promise<ItemEntity> {
    let item = await this.findOne({ where: { youtrackId } });
    if (!item) {
      item = new ItemEntity();
      item.youtrackId = youtrackId;
    }
    return item;
  }

  async getIdFoundedByYoutrackIdOrCreated(
    name: string,
    youtrackItemId: string,
    newAlways = false,
  ): Promise<number> {
    let findItem = await this.findOne({
      where: { youtrackId: youtrackItemId },
    });
    if (!findItem) {
      if (newAlways) {
        return null;
      } else {
        findItem = await this.save(
          new ItemEntity({ name, youtrackId: youtrackItemId }),
        );
      }
    }
    return findItem.id;
  }
}
