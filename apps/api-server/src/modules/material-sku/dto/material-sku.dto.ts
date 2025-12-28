import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMaterialSkuDto {
  @ApiProperty({ description: '物料ID' })
  @IsInt()
  @IsNotEmpty()
  materialId: number;

  @ApiProperty({ description: 'SKU名称' })
  @IsString()
  @IsNotEmpty()
  skuName: string;

  @ApiPropertyOptional({ description: 'SKU编码' })
  @IsString()
  @IsOptional()
  skuCode?: string;

  @ApiPropertyOptional({ description: 'SKU编号' })
  @IsString()
  @IsOptional()
  skuNo?: string;

  @ApiPropertyOptional({ description: '品牌' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: '规格' })
  @IsString()
  @IsOptional()
  spec?: string;

  @ApiPropertyOptional({ description: '单位' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: '重量(kg)' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: '条形码' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: '图片URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: '属性' })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ description: '成本价' })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({ description: '销售价' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ description: '市场价' })
  @IsNumber()
  @IsOptional()
  marketPrice?: number;

  @ApiPropertyOptional({ description: '库存' })
  @IsInt()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ description: '最小起订量' })
  @IsInt()
  @IsOptional()
  minOrderQty?: number;

  @ApiPropertyOptional({ description: '步进数量' })
  @IsInt()
  @IsOptional()
  stepQty?: number;
}

export class UpdateMaterialSkuDto {
  @ApiPropertyOptional({ description: 'SKU名称' })
  @IsString()
  @IsOptional()
  skuName?: string;

  @ApiPropertyOptional({ description: '品牌' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: '规格' })
  @IsString()
  @IsOptional()
  spec?: string;

  @ApiPropertyOptional({ description: '单位' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: '重量(kg)' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: '条形码' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: '图片URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: '属性' })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ description: '成本价' })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({ description: '销售价' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ description: '市场价' })
  @IsNumber()
  @IsOptional()
  marketPrice?: number;

  @ApiPropertyOptional({ description: '库存' })
  @IsInt()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ description: '最小起订量' })
  @IsInt()
  @IsOptional()
  minOrderQty?: number;

  @ApiPropertyOptional({ description: '步进数量' })
  @IsInt()
  @IsOptional()
  stepQty?: number;
}

export class MaterialSkuQueryDto {
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

  @ApiPropertyOptional({ description: '物料ID' })
  @IsOptional()
  @Type(() => Number)
  materialId?: number;

  @ApiPropertyOptional({ description: '品牌' })
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @Type(() => Number)
  status?: number;
}

export class UpdateSkuStatusDto {
  @ApiProperty({ description: '状态：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  status: number;
}
