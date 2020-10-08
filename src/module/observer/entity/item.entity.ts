import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { DirectionEntity } from './direction.entity';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';


@Entity('item')
export class ItemEntity extends RowEntity<ItemEntity> {

  @Column({ type: 'varchar', nullable: false, length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  idYoutrack: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  estimationTime?: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  spentTime?: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  endDate?: Date;

  @Column({ type: 'numeric', nullable: true })
  percent?: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  fixVersions?: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  comment?: string;

  @RelationId((item: ItemEntity) => item.direction)
  @Column({ type: 'integer', nullable: false })
  directionId: number;

  @ManyToOne(() => DirectionEntity, (direction: DirectionEntity) => direction.id)
  direction: DirectionEntity;

  @RelationId((item: ItemEntity) => item.project)
  @Column({ type: 'integer', nullable: false })
  projectId: number;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.id)
  project: ProjectEntity;

  @RelationId((item: ItemEntity) => item.user)
  @Column({ type: 'integer', nullable: false })
  assignee: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  user: UserEntity;

  @RelationId((item: ItemEntity) => item.parentItem)
  @Column({ type: 'integer', nullable: true })
  parentItemId?: number;

  @ManyToOne(() => ItemEntity, (parentItem: ItemEntity) => parentItem.id)
  parentItem?: UserEntity;
}