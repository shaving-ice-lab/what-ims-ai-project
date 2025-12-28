import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Supplier } from './supplier.entity';
import { Admin } from './admin.entity';

export enum SettingChangeType {
  MIN_ORDER = 'min_order',
  DELIVERY_DAYS = 'delivery_days',
  DELIVERY_AREA = 'delivery_area',
}

export enum SettingAuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('supplier_setting_audits')
@Index('idx_supplier_id', ['supplierId'])
@Index('idx_status', ['status'])
@Index('idx_submit_time', ['submitTime'])
export class SupplierSettingAudit extends BaseEntity {
  @Column({ name: 'supplier_id', type: 'bigint' })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    name: 'change_type',
    type: 'enum',
    enum: SettingChangeType,
  })
  changeType: SettingChangeType;

  @Column({ name: 'old_value', type: 'json', nullable: true })
  oldValue: Record<string, unknown>;

  @Column({ name: 'new_value', type: 'json' })
  newValue: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: SettingAuditStatus,
    default: SettingAuditStatus.PENDING,
  })
  status: SettingAuditStatus;

  @CreateDateColumn({ name: 'submit_time' })
  submitTime: Date;

  @Column({ name: 'audit_time', type: 'datetime', nullable: true })
  auditTime: Date;

  @Column({ name: 'auditor_id', type: 'bigint', nullable: true })
  auditorId: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'auditor_id' })
  auditor: Admin;

  @Column({
    name: 'reject_reason',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  rejectReason: string;
}
