import { EntityRepository } from 'typeorm';
import {BaseRepository} from 'typeorm-transactional-cls-hooked';
import { ItemEntity } from '../entity/item.entity';

@EntityRepository(ItemEntity)
export class ItemRepository extends BaseRepository<ItemEntity> {
}
