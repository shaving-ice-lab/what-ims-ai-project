import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('categories')
@Index('idx_parent_id', ['parentId'])
@Index('idx_sort_order', ['sortOrder'])
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'markup_enabled', type: 'tinyint', default: 1 })
  markupEnabled: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
