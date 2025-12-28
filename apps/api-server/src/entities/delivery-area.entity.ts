import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Supplier } from './supplier.entity';

@Entity('delivery_areas')
@Index('idx_supplier_id', ['supplierId'])
@Index('idx_area', ['province', 'city', 'district'])
@Index('uk_supplier_area', ['supplierId', 'province', 'city', 'district'], {
  unique: true,
})
export class DeliveryArea extends BaseEntity {
  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'varchar', length: 50 })
  province: string;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
