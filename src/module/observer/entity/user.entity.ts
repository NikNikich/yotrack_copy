import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { RoleEntity } from './role.entity';
import { DirectionEntity } from './direction.entity';
import { ItemEntity } from './item.entity';

@Entity('user')
export class UserEntity extends RowEntity<UserEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

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