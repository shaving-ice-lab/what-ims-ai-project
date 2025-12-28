import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  StockStatus,
  AuditStatus,
} from '../../../entities/supplier-material.entity';

export class CreateSupplierMaterialDto {
  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @ApiProperty({ description: '物料SKU ID' })
  @IsInt()
  @IsNotEmpty()
  materialSkuId: number;

  @ApiProperty({ description: '报价' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ description: '原价' })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({ description: '最小起订量', default: 1 })
  @IsInt()
  @IsOptional()
  minQuantity?: number;

  @ApiPropertyOptional({ description: '步进数量', default: 1 })
  @IsInt()
  @IsOptional()
  stepQuantity?: number;

  @ApiPropertyOptional({
    description: '库存状态',
    enum: StockStatus,
    default: StockStatus.IN_STOCK,
  })
  @IsEnum(StockStatus)
  @IsOptional()
  stockStatus?: StockStatus;
}

export class UpdateSupplierMaterialDto {
  @ApiPropertyOptional({ description: '报价' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: '原价' })
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({ description: '最小起订量' })
  @IsInt()
  @IsOptional()
  minQuantity?: number;

  @ApiPropertyOptional({ description: '步进数量' })
  @IsInt()
  @IsOptional()
  stepQuantity?: number;

  @ApiPropertyOptional({ description: '库存状态', enum: StockStatus })
  @IsEnum(StockStatus)
  @IsOptional()
  stockStatus?: StockStatus;
}

export class SupplierMaterialQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @Type(() => Number)
  supplierId?: number;

  @ApiPropertyOptional({ description: '物料SKU ID' })
  @IsOptional()
  @Type(() => Number)
  materialSkuId?: number;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ description: '库存状态', enum: StockStatus })
  @IsOptional()
  stockStatus?: StockStatus;

  @ApiPropertyOptional({ description: '审核状态', enum: AuditStatus })
  @IsOptional()
  auditStatus?: AuditStatus;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @Type(() => Number)
  status?: number;
}

export class UpdateStockStatusDto {
  @ApiProperty({ description: '库存状态', enum: StockStatus })
  @IsEnum(StockStatus)
  @IsNotEmpty()
  stockStatus: StockStatus;
}

export class AuditSupplierMaterialDto {
  @ApiProperty({ description: '审核状态', enum: ['approved', 'rejected'] })
  @IsEnum(['approved', 'rejected'])
  @IsNotEmpty()
  auditStatus: 'approved' | 'rejected';

  @ApiPropertyOptional({ description: '驳回原因' })
  @IsString()
  @IsOptional()
  rejectReason?: string;
}

export class BatchUpdatePriceDto {
  @ApiProperty({ description: '物料SKU ID列表' })
  @IsInt({ each: true })
  @IsNotEmpty()
  materialSkuIds: number[];

  @ApiProperty({ description: '调整类型：fixed固定金额，percent百分比' })
  @IsEnum(['fixed', 'percent'])
  @IsNotEmpty()
  adjustType: 'fixed' | 'percent';

  @ApiProperty({ description: '调整值' })
  @IsNumber()
  @IsNotEmpty()
  adjustValue: number;
}
