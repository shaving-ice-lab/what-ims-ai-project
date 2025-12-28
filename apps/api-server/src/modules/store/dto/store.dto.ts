import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ description: '门店名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '门店编号' })
  @IsString()
  @IsOptional()
  storeNo?: string;

  @ApiProperty({ description: '联系人姓名' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiProperty({ description: '省' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ description: '市' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ description: '区/县' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ description: '详细地址' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: '经度' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ description: '纬度' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ description: '关联用户ID' })
  @IsInt()
  @IsOptional()
  userId?: number;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: '门店名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '联系人姓名' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ description: '省' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: '市' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: '区/县' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ description: '详细地址' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: '经度' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ description: '纬度' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateMarkupDto {
  @ApiProperty({ description: '加价开关：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  markupEnabled: number;
}

export class UpdateStatusDto {
  @ApiProperty({ description: '状态：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  status: number;
}

export class StoreQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  keyword?: string;

  @ApiPropertyOptional({ description: '状态筛选' })
  @IsOptional()
  status?: number;

  @ApiPropertyOptional({ description: '省筛选' })
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: '市筛选' })
  @IsOptional()
  city?: string;
}
