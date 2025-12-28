import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Supplier } from './supplier.entity';
import { MaterialSku } from './material-sku.entity';

export enum StockStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum AuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('supplier_materials')
@Index('uk_supplier_sku', ['supplierId', 'materialSkuId'], { unique: true })
@Index('idx_material_sku_id', ['materialSkuId'])
@Index('idx_price', ['price'])
@Index('idx_stock_status', ['stockStatus'])
@Index('idx_audit_status', ['auditStatus'])
export class SupplierMaterial extends BaseEntity {
  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'material_sku_id', type: 'bigint' })
  materialSkuId: number;

  @ManyToOne(() => MaterialSku)
  @JoinColumn({ name: 'material_sku_id' })
  materialSku: MaterialSku;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'original_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  originalPrice: number;

  @Column({ name: 'min_quantity', type: 'int', default: 1 })
  minQuantity: number;

  @Column({ name: 'step_quantity', type: 'int', default: 1 })
  stepQuantity: number;

  @Column({
    name: 'stock_status',
    type: 'enum',
    enum: StockStatus,
    default: StockStatus.IN_STOCK,
  })
  stockStatus: StockStatus;

  @Column({
    name: 'audit_status',
    type: 'enum',
    enum: AuditStatus,
    default: AuditStatus.PENDING,
  })
  auditStatus: AuditStatus;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  rejectReason: string;

  @Column({ name: 'is_recommended', type: 'tinyint', default: 0 })
  isRecommended: number;

  @Column({ name: 'sales_count', type: 'int', default: 0 })
  salesCount: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
