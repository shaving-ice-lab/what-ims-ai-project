import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum SupplierManagementMode {
  SELF = 'self',
  MANAGED = 'managed',
  WEBHOOK = 'webhook',
  API = 'api',
}

export enum DeliveryMode {
  SELF_DELIVERY = 'self_delivery',
  EXPRESS_DELIVERY = 'express_delivery',
}

@Entity('suppliers')
@Index('idx_user_id', ['userId'])
@Index('idx_status', ['status'])
export class Supplier extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'supplier_no', type: 'varchar', length: 50, unique: true })
  supplierNo: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo: string;

  @Column({ name: 'contact_name', type: 'varchar', length: 50 })
  contactName: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20 })
  contactPhone: string;

  @Column({
    name: 'business_license',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  businessLicense: string;

  @Column({
    name: 'management_mode',
    type: 'enum',
    enum: SupplierManagementMode,
    default: SupplierManagementMode.SELF,
  })
  managementMode: SupplierManagementMode;

  @Column({
    name: 'delivery_mode',
    type: 'enum',
    enum: DeliveryMode,
    default: DeliveryMode.SELF_DELIVERY,
  })
  deliveryMode: DeliveryMode;

  @Column({
    name: 'min_order_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minOrderAmount: number;

  @Column({ name: 'delivery_days', type: 'json', nullable: true })
  deliveryDays: number[];

  @Column({ name: 'cut_off_time', type: 'time', nullable: true })
  cutOffTime: string;

  @Column({ name: 'has_backend', type: 'tinyint', default: 1 })
  hasBackend: number;

  @Column({
    name: 'wechat_webhook_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  wechatWebhookUrl: string;

  @Column({ name: 'webhook_enabled', type: 'tinyint', default: 0 })
  webhookEnabled: number;

  @Column({ name: 'webhook_events', type: 'json', nullable: true })
  webhookEvents: string[];

  @Column({
    name: 'api_endpoint',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  apiEndpoint: string;

  @Column({
    name: 'api_secret_key',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apiSecretKey: string;

  @Column({ name: 'markup_enabled', type: 'tinyint', default: 1 })
  markupEnabled: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'text', nullable: true })
  remark: string;
}
