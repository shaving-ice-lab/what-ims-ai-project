import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';

@Entity('materials')
@Index('idx_supplier_id', ['supplierId'])
@Index('idx_category_id', ['categoryId'])
@Index('idx_material_no', ['materialNo'])
@Index('idx_status', ['status'])
export class Material extends BaseEntity {
  @Column({ name: 'material_no', type: 'varchar', length: 50, unique: true })
  materialNo: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  alias: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  keywords: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  spec: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
