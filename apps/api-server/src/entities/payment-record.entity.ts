import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order, PaymentMethod } from './order.entity';

export enum PaymentRecordStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
}

@Entity('payment_records')
@Index('uk_payment_no', ['paymentNo'], { unique: true })
@Index('idx_order_id', ['orderId'])
@Index('idx_trade_no', ['tradeNo'])
@Index('idx_status', ['status'])
@Index('idx_created_at', ['createdAt'])
export class PaymentRecord extends BaseEntity {
  @Column({ name: 'order_id', type: 'bigint' })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_no', type: 'varchar', length: 30 })
  orderNo: string;

  @Column({ name: 'payment_no', type: 'varchar', length: 50, unique: true })
  paymentNo: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'goods_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  goodsAmount: number;

  @Column({
    name: 'service_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  serviceFee: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentRecordStatus,
    default: PaymentRecordStatus.PENDING,
  })
  status: PaymentRecordStatus;

  @Column({ name: 'qrcode_url', type: 'varchar', length: 500, nullable: true })
  qrcodeUrl: string;

  @Column({ name: 'qrcode_expire_time', type: 'datetime', nullable: true })
  qrcodeExpireTime: Date;

  @Column({ name: 'trade_no', type: 'varchar', length: 100, nullable: true })
  tradeNo: string;

  @Column({ name: 'pay_time', type: 'datetime', nullable: true })
  payTime: Date;

  @Column({ name: 'callback_data', type: 'json', nullable: true })
  callbackData: Record<string, unknown>;

  @Column({ name: 'refund_no', type: 'varchar', length: 50, nullable: true })
  refundNo: string;

  @Column({
    name: 'refund_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  refundAmount: number;

  @Column({ name: 'refund_time', type: 'datetime', nullable: true })
  refundTime: Date;

  @Column({
    name: 'refund_reason',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  refundReason: string;

  @Column({ name: 'error_msg', type: 'varchar', length: 500, nullable: true })
  errorMsg: string;
}
