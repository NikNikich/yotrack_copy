import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { UserEntity } from './user.entity';
import { ItemEntity } from './item.entity';

@Entity('direction')
export class DirectionEntity extends RowEntity<DirectionEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.direction)
  user?: UserEntity[];


  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.direction)
  item?: ItemEntity[];

}