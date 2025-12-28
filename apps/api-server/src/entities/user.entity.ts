import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum UserRole {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub_admin',
  SUPPLIER = 'supplier',
  STORE = 'store',
}

@Entity('users')
@Index('idx_username', ['username'])
@Index('idx_phone', ['phone'])
@Index('idx_role_status', ['role', 'status'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @Column({
    name: 'last_login_ip',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  lastLoginIp: string;

  @Column({ name: 'login_fail_count', type: 'int', default: 0 })
  loginFailCount: number;

  @Column({ name: 'locked_until', type: 'datetime', nullable: true })
  lockedUntil: Date;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
