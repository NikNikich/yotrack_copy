import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { UserEntity } from './user.entity';

@Entity('role')
export class RoleEntity extends RowEntity<RoleEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;


  @RelationId((role:  RoleEntity) => role.rolePermission)
  @Column({type: 'integer', nullable: false})
  rolePermissionId: number;

  @ManyToOne(
    () => RolePermissionEntity, (rolePermission: RolePermissionEntity) => rolePermission.id
  )
  rolePermission?: RolePermissionEntity;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.role)
  user?: UserEntity[];
}