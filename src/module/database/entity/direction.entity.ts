import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { UserEntity } from './user.entity';
import { ItemEntity } from './item.entity';
import { ProjectInformationEntity } from './project_information.entity';

@Entity('direction')
export class DirectionEntity extends RowEntity<DirectionEntity> {
  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  youtrackId?: string;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.direction)
  items?: ItemEntity[];

  @OneToMany(
    () => ProjectInformationEntity,
    (information) => information.direction,
  )
  projectInformation?: ProjectInformationEntity[];
}
