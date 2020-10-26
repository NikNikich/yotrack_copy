import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { TimeTrackingEntity } from '../entity/time-tracking.entity';

@EntityRepository(TimeTrackingEntity)
export class TimeTrackingRepository extends BaseRepository<TimeTrackingEntity> {
  async findByItemIdAndYoutrackIdOrCreate(
    itemId: number,
    youtrackId: string,
  ): Promise<TimeTrackingEntity> {
    let timeTrack = await this.findOne({ where: { itemId, youtrackId } });
    if (!timeTrack) {
      timeTrack = new TimeTrackingEntity({
        itemId,
        youtrackId,
      });
    }
    return timeTrack;
  }
}
