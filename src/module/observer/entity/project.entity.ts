import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ItemEntity } from './item.entity';

@Entity('project')
export class ProjectEntity extends RowEntity<ProjectEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.project)
  item?: ItemEntity[];

}