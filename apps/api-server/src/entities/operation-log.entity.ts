import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum LogOperatorType {
  ADMIN = 'admin',
  SUPPLIER = 'supplier',
  STORE = 'store',
  SYSTEM = 'system',
}

@Entity('operation_logs')
@Index('idx_user', ['userType', 'userId'])
@Index('idx_module_action', ['module', 'action'])
@Index('idx_target', ['targetType', 'targetId'])
@Index('idx_created_at', ['createdAt'])
export class OperationLog extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: number;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: LogOperatorType,
    nullable: true,
  })
  userType: LogOperatorType;

  @Column({ name: 'user_name', type: 'varchar', length: 50, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ name: 'target_type', type: 'varchar', length: 50, nullable: true })
  targetType: string;

  @Column({ name: 'target_id', type: 'bigint', nullable: true })
  targetId: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'before_data', type: 'json', nullable: true })
  beforeData: Record<string, unknown>;

  @Column({ name: 'after_data', type: 'json', nullable: true })
  afterData: Record<string, unknown>;

  @Column({ name: 'diff_data', type: 'json', nullable: true })
  diffData: Record<string, unknown>;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ name: 'request_url', type: 'varchar', length: 500, nullable: true })
  requestUrl: string;

  @Column({
    name: 'request_method',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  requestMethod: string;
}
