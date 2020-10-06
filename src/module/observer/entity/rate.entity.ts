import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ProjectEntity } from './project.entity';
import { DirectionEntity } from './direction.entity';

@Entity('rate')
export class RateEntity extends RowEntity<RateEntity> {

  @Column({ type: 'numeric', nullable: false })
  summa: number;

  @RelationId((rate: RateEntity) => rate.project)
  @Column({ type: 'integer', nullable: false })
  projectId: number;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.id)
  project: ProjectEntity;

  @RelationId((rate: RateEntity) => rate.direction)
  @Column({ type: 'integer', nullable: false })
  directionId: number;

  @ManyToOne(() => DirectionEntity, (direction: DirectionEntity) => direction.id)
  direction: DirectionEntity;
}