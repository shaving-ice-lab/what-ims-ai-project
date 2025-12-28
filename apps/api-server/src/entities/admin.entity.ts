import {
  Entity,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('admins')
@Index('idx_user_id', ['userId'])
export class Admin extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_primary', type: 'tinyint', default: 0 })
  isPrimary: number;

  @Column({ name: 'is_super_admin', type: 'tinyint', default: 0 })
  isSuperAdmin: number;

  @Column({ type: 'json', nullable: true })
  permissions: string[];

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'created_by' })
  creator: Admin;

  @Column({ type: 'varchar', length: 200, nullable: true })
  remark: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
