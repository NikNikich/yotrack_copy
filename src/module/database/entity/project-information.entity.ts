import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ProjectEntity } from './project.entity';
import { DirectionEntity } from './direction.entity';

@Entity('project_information')
export class ProjectInformationEntity extends RowEntity<ProjectInformationEntity> {
  @Column({ type: 'real',nullable: true })
  rate?: number;

  @Column({ type: 'real',nullable: true})
  projectEstimation?: number;

  @RelationId((information: ProjectInformationEntity) => information.project)
  @Column({ type: 'integer', nullable: true })
  projectId?: number;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.id)
  project?: ProjectEntity;

  @RelationId((information: ProjectInformationEntity) => information.direction)
  @Column({ type: 'integer', nullable: true})
  directionId?: number;

  @ManyToOne(
    () => DirectionEntity,
    (direction: DirectionEntity) => direction.id,
  )
  direction?: DirectionEntity;
}
