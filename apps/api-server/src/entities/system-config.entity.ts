import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ConfigType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

@Entity('system_configs')
@Index('uk_config_key', ['configKey'], { unique: true })
export class SystemConfig {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'config_key', type: 'varchar', length: 100, unique: true })
  configKey: string;

  @Column({ name: 'config_value', type: 'text', nullable: true })
  configValue: string;

  @Column({
    name: 'config_type',
    type: 'enum',
    enum: ConfigType,
    default: ConfigType.STRING,
  })
  configType: ConfigType;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ name: 'is_sensitive', type: 'tinyint', default: 0 })
  isSensitive: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
