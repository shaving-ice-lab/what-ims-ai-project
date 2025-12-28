import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MarkupType } from '../../../entities/price-markup.entity';

export class CreatePriceMarkupDto {
  @ApiProperty({ description: '规则名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '规则说明' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '门店ID，为空表示全部门店' })
  @IsInt()
  @IsOptional()
  storeId?: number;

  @ApiPropertyOptional({ description: '供应商ID，为空表示全部供应商' })
  @IsInt()
  @IsOptional()
  supplierId?: number;

  @ApiPropertyOptional({ description: '分类ID，为空表示全部分类' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '物料ID，为空表示全部物料' })
  @IsInt()
  @IsOptional()
  materialId?: number;

  @ApiProperty({
    description: '加价方式：fixed固定金额，percent百分比',
    enum: MarkupType,
  })
  @IsEnum(MarkupType)
  @IsNotEmpty()
  markupType: MarkupType;

  @ApiProperty({ description: '加价值（固定金额或百分比如0.05表示5%）' })
  @IsNumber()
  @IsNotEmpty()
  markupValue: number;

  @ApiPropertyOptional({ description: '最低加价金额（百分比时）' })
  @IsNumber()
  @IsOptional()
  minMarkup?: number;

  @ApiPropertyOptional({ description: '最高加价金额（百分比时）' })
  @IsNumber()
  @IsOptional()
  maxMarkup?: number;

  @ApiPropertyOptional({
    description: '优先级，数值越大优先级越高',
    default: 0,
  })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: '生效开始时间' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: '生效结束时间' })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

export class UpdatePriceMarkupDto {
  @ApiPropertyOptional({ description: '规则名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '规则说明' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '门店ID' })
  @IsInt()
  @IsOptional()
  storeId?: number;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsInt()
  @IsOptional()
  supplierId?: number;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '物料ID' })
  @IsInt()
  @IsOptional()
  materialId?: number;

  @ApiPropertyOptional({ description: '加价方式', enum: MarkupType })
  @IsEnum(MarkupType)
  @IsOptional()
  markupType?: MarkupType;

  @ApiPropertyOptional({ description: '加价值' })
  @IsNumber()
  @IsOptional()
  markupValue?: number;

  @ApiPropertyOptional({ description: '最低加价金额' })
  @IsNumber()
  @IsOptional()
  minMarkup?: number;

  @ApiPropertyOptional({ description: '最高加价金额' })
  @IsNumber()
  @IsOptional()
  maxMarkup?: number;

  @ApiPropertyOptional({ description: '优先级' })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: '生效开始时间' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: '生效结束时间' })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

export class PriceMarkupQueryDto {
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

  @ApiPropertyOptional({ description: '门店ID' })
  @IsOptional()
  @Type(() => Number)
  storeId?: number;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @Type(() => Number)
  supplierId?: number;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: '加价方式', enum: MarkupType })
  @IsOptional()
  markupType?: MarkupType;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @Type(() => Number)
  isActive?: number;
}

export class UpdateMarkupStatusDto {
  @ApiProperty({ description: '是否启用：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  isActive: number;
}

export class CalculateMarkupDto {
  @ApiProperty({ description: '原价' })
  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

  @ApiPropertyOptional({ description: '门店ID' })
  @IsInt()
  @IsOptional()
  storeId?: number;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsInt()
  @IsOptional()
  supplierId?: number;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: '物料ID' })
  @IsInt()
  @IsOptional()
  materialId?: number;
}
