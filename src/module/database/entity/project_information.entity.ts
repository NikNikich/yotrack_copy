import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ProjectEntity } from './project.entity';
import { DirectionEntity } from './direction.entity';

@Entity('project_information')
export class ProjectInformationEntity extends RowEntity<
  ProjectInformationEntity
> {
  @Column({ type: 'numeric', nullable: false })
  rate: number;

  @Column({ type: 'numeric', nullable: false })
  project_estimation: number;

  @RelationId((information: ProjectInformationEntity) => information.project)
  @Column({ type: 'integer', nullable: false })
  projectId: number;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.id)
  project: ProjectEntity;

  @RelationId((information: ProjectInformationEntity) => information.direction)
  @Column({ type: 'integer', nullable: false })
  directionId: number;

  @ManyToOne(
    () => DirectionEntity,
    (direction: DirectionEntity) => direction.id,
  )
  direction: DirectionEntity;
}
