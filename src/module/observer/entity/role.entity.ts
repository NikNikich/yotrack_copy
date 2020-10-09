import { Column, Entity, ManyToMany, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { AccessRightEntity } from './accessRight.entity';
import { UserEntity } from './user.entity';

@Entity('role')
export class RoleEntity extends RowEntity<RoleEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50})
  hubId: string;

  @ManyToMany(
    (type) => AccessRightEntity,
    (accessRight) => accessRight.roles
  )
  accessRights: AccessRightEntity[];

  @OneToMany(() => UserEntity, (userEntity) => userEntity.role)
  users?: UserEntity[];
}