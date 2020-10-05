import { Column, Entity, OneToMany } from 'typeorm';
import { RowEntity } from './shared/row.entity';
import { ItemEntity } from './item.entity';

@Entity('fix_version')
export class FixVersionEntity extends RowEntity<FixVersionEntity> {

  @Column({type: 'varchar', nullable: true, length: 255})
  name?: string;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.fixVersion)
  item?: ItemEntity[];

}