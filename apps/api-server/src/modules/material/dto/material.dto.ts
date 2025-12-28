import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '父分类ID' })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @ApiPropertyOptional({ description: '图标URL' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '排序值' })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: '分类名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '图标URL' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '排序值' })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '加价开关' })
  @IsInt()
  @IsOptional()
  markupEnabled?: number;
}

export class CreateMaterialDto {
  @ApiProperty({ description: '物料名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '物料编号' })
  @IsString()
  @IsOptional()
  materialNo?: string;

  @ApiPropertyOptional({ description: '别名' })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({ description: '关键词' })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({ description: '图片URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '品牌' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: '单位' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: '规格' })
  @IsString()
  @IsOptional()
  spec?: string;

  @ApiPropertyOptional({ description: '条形码' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '图片列表' })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: '排序值' })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateMaterialDto {
  @ApiPropertyOptional({ description: '物料名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '别名' })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({ description: '关键词' })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({ description: '图片URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '品牌' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: '单位' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: '规格' })
  @IsString()
  @IsOptional()
  spec?: string;

  @ApiPropertyOptional({ description: '条形码' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '图片列表' })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: '排序值' })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class MaterialQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @Type(() => Number)
  supplierId?: number;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @Type(() => Number)
  status?: number;
}

export class UpdateStatusDto {
  @ApiProperty({ description: '状态：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  status: number;
}
