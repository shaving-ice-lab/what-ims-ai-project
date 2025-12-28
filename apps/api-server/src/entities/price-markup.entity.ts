import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Store } from './store.entity';
import { Supplier } from './supplier.entity';
import { Category } from './category.entity';
import { Material } from './material.entity';

export enum MarkupType {
  FIXED = 'fixed',
  PERCENT = 'percent',
}

@Entity('price_markups')
@Index('idx_active_priority', ['isActive', 'priority'])
@Index('idx_store_id', ['storeId'])
@Index('idx_supplier_id', ['supplierId'])
@Index('idx_material_id', ['materialId'])
export class PriceMarkup extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'store_id', type: 'bigint', nullable: true })
  storeId: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'supplier_id', type: 'bigint', nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'material_id', type: 'bigint', nullable: true })
  materialId: number;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({
    name: 'markup_type',
    type: 'enum',
    enum: MarkupType,
  })
  markupType: MarkupType;

  @Column({
    name: 'markup_value',
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  markupValue: number;

  @Column({
    name: 'min_markup',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minMarkup: number;

  @Column({
    name: 'max_markup',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxMarkup: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy: number;
}
