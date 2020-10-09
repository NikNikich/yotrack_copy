import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ItemEntity } from './item.entity';
import { ProjectInformationEntity } from './project_information.entity';

@Entity('project')
export class ProjectEntity extends RowEntity<ProjectEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50})
  youtrackId: string;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.project)
  items?: ItemEntity[];

  @OneToMany(
    () => ProjectInformationEntity,
    (information) => information.project
  )
  projectInformation?: ProjectInformationEntity[];


}