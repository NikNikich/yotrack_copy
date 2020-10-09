import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { AccessRightEntity } from './accessRight.entity';
import { RoleEntity } from './role.entity';
import { DirectionEntity } from './direction.entity';
import { ItemEntity } from './item.entity';

@Entity('user')
export class UserEntity extends RowEntity<UserEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  fullName: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  youtrackId: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  hubId: string;

  @RelationId((user: UserEntity) => user.role)
  @Column({ type: 'integer', nullable: false })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.id)
  role: RoleEntity;

  @RelationId((user: UserEntity) => user.direction)
  @Column({ type: 'integer', nullable: true })
  directionId?: number;

  @ManyToOne(() => DirectionEntity, (direction: DirectionEntity) => direction.id)
  direction?: DirectionEntity;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.user)
  items?: ItemEntity[];
}