import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { RoleEntity } from './role.entity';

@Entity('role_permission')
export class RolePermissionEntity extends RowEntity<RolePermissionEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;

  @OneToMany(() => RoleEntity, (roleEvents) => roleEvents.rolePermission)
  role?: RoleEntity[];

}