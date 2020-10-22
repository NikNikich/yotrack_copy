import { EntityRepository } from 'typeorm';
import {BaseRepository} from 'typeorm-transactional-cls-hooked';
import { DirectionEntity } from '../entity/direction.entity';

@EntityRepository(DirectionEntity)
export class DirectionRepository extends BaseRepository<DirectionEntity> {
}
