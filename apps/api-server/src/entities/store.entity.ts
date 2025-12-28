import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('stores')
@Index('idx_user_id', ['userId'])
@Index('idx_status', ['status'])
export class Store extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'store_no', type: 'varchar', length: 50, unique: true })
  storeNo: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo: string;

  @Column({ name: 'contact_name', type: 'varchar', length: 50 })
  contactName: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20 })
  contactPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  province: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({
    name: 'business_hours',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  businessHours: string;

  @Column({ name: 'markup_enabled', type: 'tinyint', default: 1 })
  markupEnabled: number;

  @Column({
    name: 'wechat_webhook_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  wechatWebhookUrl: string;

  @Column({ name: 'webhook_enabled', type: 'tinyint', default: 0 })
  webhookEnabled: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  remark: string;
}
