import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum RuleType {
  NAME = 'name',
  BRAND = 'brand',
  SKU = 'sku',
  KEYWORD = 'keyword',
}

@Entity('image_match_rules')
@Index('idx_active_priority', ['isActive', 'priority'])
export class ImageMatchRule extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    name: 'rule_type',
    type: 'enum',
    enum: RuleType,
  })
  ruleType: RuleType;

  @Column({ name: 'match_pattern', type: 'varchar', length: 200 })
  matchPattern: string;

  @Column({
    name: 'similarity_threshold',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.8,
  })
  similarityThreshold: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: number;
}
