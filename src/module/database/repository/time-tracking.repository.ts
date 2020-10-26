import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { TimeTrackingEntity } from '../entity/time-tracking.entity';

@EntityRepository(TimeTrackingEntity)
export class TimeTrackingRepository extends BaseRepository<TimeTrackingEntity> {

  async findByItemIdAndYoutrackIdOrCreate(eventId: number, youtrackId: string): Promise<TimeTrackingEntity> {
   /* const event = await this.findByIdActive(id);
    if (!event) {
      throw errors.EventNotFound;
    }*/
    return new TimeTrackingEntity();
  }
}

