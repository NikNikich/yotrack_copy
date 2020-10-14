import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { DirectionEntity } from './direction.entity';
import { ItemEntity } from './item.entity';
import { ProjectTeamEntity } from './projectTeam.entity';

@Entity('user')
export class UserEntity extends RowEntity<UserEntity> {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  fullName: string;

  @Column({ type: 'varchar', nullable: true, length: 50, unique: true })
  youtrackId?: string;

  @Column({ type: 'varchar', nullable: true, length: 50, unique: true })
  hubId?: string;

  @ManyToMany((type) => ProjectTeamEntity, (projectTeam) => projectTeam.users)
  projectTeams?: ProjectTeamEntity[];

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.assigneeUser)
  assigneeItems?: ItemEntity[];

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.updaterUser)
  updaterItems?: ItemEntity[];
}
