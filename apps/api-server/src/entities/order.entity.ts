import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Store } from './store.entity';
import { Supplier } from './supplier.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PENDING_CONFIRM = 'pending_confirm',
  CONFIRMED = 'confirmed',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
}

export enum OrderSource {
  APP = 'app',
  WEB = 'web',
  H5 = 'h5',
}

export enum CancelledByType {
  STORE = 'store',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

@Entity('orders')
@Index('uk_order_no', ['orderNo'], { unique: true })
@Index('idx_store_id', ['storeId'])
@Index('idx_supplier_id', ['supplierId'])
@Index('idx_status', ['status'])
@Index('idx_payment_status', ['paymentStatus'])
@Index('idx_created_at', ['createdAt'])
@Index('idx_store_status_created', ['storeId', 'status', 'createdAt'])
@Index('idx_supplier_status_created', ['supplierId', 'status', 'createdAt'])
export class Order extends BaseEntity {
  @Column({ name: 'order_no', type: 'varchar', length: 30, unique: true })
  orderNo: string;

  @Column({ name: 'store_id', type: 'bigint' })
  storeId: number;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

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
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    name: 'supplier_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  supplierAmount: number;

  @Column({
    name: 'markup_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  markupTotal: number;

  @Column({ name: 'item_count', type: 'int', default: 0 })
  itemCount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_time', type: 'datetime', nullable: true })
  paymentTime: Date;

  @Column({ name: 'payment_no', type: 'varchar', length: 50, nullable: true })
  paymentNo: string;

  @Column({
    name: 'order_source',
    type: 'enum',
    enum: OrderSource,
    default: OrderSource.WEB,
  })
  orderSource: OrderSource;

  @Column({ name: 'delivery_province', type: 'varchar', length: 50 })
  deliveryProvince: string;

  @Column({ name: 'delivery_city', type: 'varchar', length: 50 })
  deliveryCity: string;

  @Column({ name: 'delivery_district', type: 'varchar', length: 50 })
  deliveryDistrict: string;

  @Column({ name: 'delivery_address', type: 'varchar', length: 200 })
  deliveryAddress: string;

  @Column({ name: 'delivery_contact', type: 'varchar', length: 50 })
  deliveryContact: string;

  @Column({ name: 'delivery_phone', type: 'varchar', length: 20 })
  deliveryPhone: string;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'actual_delivery_time', type: 'datetime', nullable: true })
  actualDeliveryTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string;

  @Column({
    name: 'supplier_remark',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  supplierRemark: string;

  @Column({
    name: 'cancel_reason',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  cancelReason: string;

  @Column({
    name: 'cancelled_by',
    type: 'enum',
    enum: CancelledByType,
    nullable: true,
  })
  cancelledBy: CancelledByType;

  @Column({ name: 'cancelled_by_id', type: 'bigint', nullable: true })
  cancelledById: number;

  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'restored_at', type: 'datetime', nullable: true })
  restoredAt: Date;

  @Column({ name: 'confirmed_at', type: 'datetime', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'delivering_at', type: 'datetime', nullable: true })
  deliveringAt: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @OneToMany('OrderItem', 'order')
  items: import('./order-item.entity').OrderItem[];
}
