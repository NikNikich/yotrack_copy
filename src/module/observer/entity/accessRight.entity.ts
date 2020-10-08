import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { RoleEntity } from './role.entity';

@Entity('access_right')
export class AccessRightEntity extends RowEntity<AccessRightEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  idHub: string;

  @OneToMany(() => RoleEntity, (roleEvents) => roleEvents.accessRight)
  roles?: RoleEntity[];

}