import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Type } from 'class-transformer';

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export abstract class ConstructableEntity<T = ConstructableEntity<Record<string, unknown>>> {
  constructor(dto?: Pick<T, NonFunctionPropertyNames<T>>) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}

export class RowEntity<T = RowEntity<Record<string, unknown>>> extends ConstructableEntity<T> {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @CreateDateColumn({type: 'timestamp with time zone'})
  @Type(() => Date)
  readonly createdAt?: Date;

  @UpdateDateColumn({type: 'timestamp with time zone'})
  @Type(() => Date)
  readonly updatedAt?: Date;
}
