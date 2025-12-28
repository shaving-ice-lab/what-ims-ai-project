import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

export enum WebhookTargetType {
  STORE = 'store',
  SUPPLIER = 'supplier',
}

export enum WebhookEventType {
  ORDER_CREATED = 'order_created',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_DELIVERING = 'order_delivering',
  ORDER_COMPLETED = 'order_completed',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_RESTORED = 'order_restored',
}

export enum WebhookStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity('webhook_logs')
@Index('idx_target', ['targetType', 'targetId'])
@Index('idx_order_id', ['orderId'])
@Index('idx_status', ['status'])
@Index('idx_created_at', ['createdAt'])
export class WebhookLog extends BaseEntity {
  @Column({
    name: 'target_type',
    type: 'enum',
    enum: WebhookTargetType,
  })
  targetType: WebhookTargetType;

  @Column({ name: 'target_id', type: 'bigint' })
  targetId: number;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: WebhookEventType,
  })
  eventType: WebhookEventType;

  @Column({ name: 'order_id', type: 'bigint', nullable: true })
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'webhook_url', type: 'varchar', length: 500 })
  webhookUrl: string;

  @Column({ name: 'request_headers', type: 'json', nullable: true })
  requestHeaders: Record<string, string>;

  @Column({ name: 'request_body', type: 'json', nullable: true })
  requestBody: Record<string, unknown>;

  @Column({ name: 'response_code', type: 'int', nullable: true })
  responseCode: number;

  @Column({ name: 'response_body', type: 'text', nullable: true })
  responseBody: string;

  @Column({
    type: 'enum',
    enum: WebhookStatus,
    default: WebhookStatus.PENDING,
  })
  status: WebhookStatus;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @Column({ name: 'next_retry_at', type: 'datetime', nullable: true })
  nextRetryAt: Date;

  @Column({ name: 'error_msg', type: 'varchar', length: 500, nullable: true })
  errorMsg: string;

  @Column({ name: 'duration_ms', type: 'int', nullable: true })
  durationMs: number;
}
