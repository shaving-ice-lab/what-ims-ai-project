import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export enum OperatorType {
  STORE = 'store',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

@Entity('order_status_logs')
@Index('idx_order_id', ['orderId'])
export class OrderStatusLog extends BaseEntity {
  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'from_status', type: 'varchar', length: 30, nullable: true })
  fromStatus: string;

  @Column({ name: 'to_status', type: 'varchar', length: 30 })
  toStatus: string;

  @Column({
    name: 'operator_type',
    type: 'enum',
    enum: OperatorType,
    nullable: true,
  })
  operatorType: OperatorType;

  @Column({ name: 'operator_id', type: 'bigint', nullable: true })
  operatorId: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  remark: string;
}
