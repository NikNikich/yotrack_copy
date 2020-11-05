import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ItemEntity } from './item.entity';
import { UserEntity } from './user.entity';
import { Type } from 'class-transformer';

@Entity('time_tracking')
export class TimeTrackingEntity extends RowEntity<TimeTrackingEntity> {
  @Column({ type: 'varchar', nullable: true, length: 10000 })
  text?: string;

  @Column({ type: 'integer', nullable: true })
  minutes?: number;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  youtrackId: string;

  @Column({ type: 'timestamp', nullable: true })
  @Type(() => Date)
  date?: Date;

  @RelationId((track: TimeTrackingEntity) => track.author)
  @Column({ type: 'integer', nullable: true })
  authorId?: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  author?: UserEntity;

  @RelationId((track: TimeTrackingEntity) => track.item)
  @Column({ type: 'integer', nullable: true })
  itemId?: number;

  @ManyToOne(() => ItemEntity, (item: ItemEntity) => item.id)
  item?: ItemEntity;
}
