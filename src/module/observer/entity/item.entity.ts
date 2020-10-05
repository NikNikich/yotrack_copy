import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { DirectionEntity } from './direction.entity';
import { ProjectEntity } from './project.entity';
import { FixVersionEntity } from './fix-version.entity';
import { UserEntity } from './user.entity';


@Entity('item')
export class ItemEntity extends RowEntity<ItemEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;

  @RelationId((item:  ItemEntity) => item.direction)
  @Column({type: 'integer', nullable: false})
  directionId: number;

  @ManyToOne(() => DirectionEntity, (direction: DirectionEntity) => direction.id)
  direction?: DirectionEntity;

  @RelationId((item:  ItemEntity) => item.project)
  @Column({type: 'integer', nullable: false})
  projectId: number;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.id)
  project?:ProjectEntity;

  @RelationId((item:  ItemEntity) => item.fixVersion)
  @Column({type: 'integer', nullable: false})
  fixVersions: number;

  @ManyToOne(() => FixVersionEntity, (fixVersion: FixVersionEntity) => fixVersion.id)
  fixVersion?:FixVersionEntity;

  @RelationId((item:  ItemEntity) => item.user)
  @Column({type: 'integer', nullable: false})
  assignee: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  user?: UserEntity;

  @RelationId((item:  ItemEntity) => item.parentItem)
  @Column({type: 'integer', nullable: false})
  parentItemId: number;

  @ManyToOne(() => ItemEntity, (parentItem: ItemEntity) => parentItem.id)
  parentItem?: UserEntity;
}