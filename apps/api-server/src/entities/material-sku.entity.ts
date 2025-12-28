import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Material } from './material.entity';

@Entity('material_skus')
@Index('idx_material_id', ['materialId'])
@Index('idx_sku_code', ['skuCode'])
export class MaterialSku extends BaseEntity {
  @Column({ name: 'material_id', type: 'bigint' })
  materialId: number;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ name: 'sku_code', type: 'varchar', length: 50, unique: true })
  skuCode: string;

  @Column({ name: 'sku_name', type: 'varchar', length: 100 })
  skuName: string;

  @Column({ name: 'sku_no', type: 'varchar', length: 30, nullable: true })
  skuNo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  spec: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  barcode: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, string>;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  costPrice: number;

  @Column({
    name: 'sale_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  salePrice: number;

  @Column({
    name: 'market_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  marketPrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'min_order_qty', type: 'int', default: 1 })
  minOrderQty: number;

  @Column({ name: 'step_qty', type: 'int', default: 1 })
  stepQty: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
