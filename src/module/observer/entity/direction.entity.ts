import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { UserEntity } from './user.entity';
import { ItemEntity } from './item.entity';
import { RateEntity } from './rate.entity';

@Entity('direction')
export class DirectionEntity extends RowEntity<DirectionEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  idYoutrack: string;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.direction)
  user?: UserEntity[];


  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.direction)
  items?: ItemEntity[];

  @OneToMany(() => RateEntity, (rateEntity) => rateEntity.direction)
  rates?: ItemEntity[];

}