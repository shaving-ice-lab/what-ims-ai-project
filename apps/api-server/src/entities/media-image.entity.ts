import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';

@Entity('media_images')
@Index('idx_category_brand', ['categoryId', 'brand'])
export class MediaImage extends BaseEntity {
  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 50, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnailUrl: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ name: 'sku_codes', type: 'json', nullable: true })
  skuCodes: string[];

  @Column({
    name: 'match_keywords',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  matchKeywords: string;

  @Column({ name: 'usage_count', type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'uploaded_by', type: 'bigint', nullable: true })
  uploadedBy: number;
}
