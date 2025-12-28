import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';
import { Admin } from './admin.entity';

export enum CancelRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('order_cancel_requests')
@Index('idx_order_id', ['orderId'])
@Index('idx_status', ['status'])
@Index('idx_created_at', ['createdAt'])
export class OrderCancelRequest extends BaseEntity {
  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'store_id', type: 'bigint' })
  storeId: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'varchar', length: 500 })
  reason: string;

  @Column({
    type: 'enum',
    enum: CancelRequestStatus,
    default: CancelRequestStatus.PENDING,
  })
  status: CancelRequestStatus;

  @Column({ name: 'admin_id', type: 'bigint', nullable: true })
  adminId: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({
    name: 'admin_remark',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  adminRemark: string;

  @Column({ name: 'supplier_contacted', type: 'tinyint', default: 0 })
  supplierContacted: number;

  @Column({
    name: 'supplier_response',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  supplierResponse: string;

  @Column({ name: 'processed_at', type: 'datetime', nullable: true })
  processedAt: Date;
}
