import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { MaterialSku } from './material-sku.entity';

@Entity('order_items')
@Index('idx_order_id', ['orderId'])
@Index('idx_material_sku_id', ['materialSkuId'])
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'material_sku_id', type: 'bigint', nullable: true })
  materialSkuId: number;

  @ManyToOne(() => MaterialSku)
  @JoinColumn({ name: 'material_sku_id' })
  materialSku: MaterialSku;

  @Column({ name: 'material_name', type: 'varchar', length: 100 })
  materialName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  spec: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Column({
    name: 'markup_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  markupAmount: number;

  @Column({
    name: 'final_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  finalPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal: number;
}
