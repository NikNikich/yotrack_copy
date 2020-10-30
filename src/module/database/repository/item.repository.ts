import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { ItemEntity } from '../entity/item.entity';

@EntityRepository(ItemEntity)
export class ItemRepository extends BaseRepository<ItemEntity> {
  async findByIdOrCreateNew(
    id: number,
    youtrackId: string,
    name: string,
  ): Promise<ItemEntity> {
    let item = await this.findOne(id);
    if (!item) {
      item = await this.createNewAndSave(youtrackId, name);
    }
    return item;
  }

  async findByYoutrackIdOrCreateNew(
    youtrackId: string,
    name: string,
  ): Promise<ItemEntity> {
    let item = await this.findOne({ where: { youtrackId } });
    if (!item) {
      item = await this.createNewAndSave(youtrackId, name);
    }
    return item;
  }

  async createNewAndSave(
    youtrackId: string,
    name: string,
  ): Promise<ItemEntity> {
    const item = new ItemEntity({ youtrackId, name });
    return this.save(item);
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
