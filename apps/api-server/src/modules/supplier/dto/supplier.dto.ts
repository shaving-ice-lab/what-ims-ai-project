import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SupplierManagementMode,
  DeliveryMode,
} from '../../../entities/supplier.entity';

export class CreateSupplierDto {
  @ApiProperty({ description: '供应商名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '门店端显示名称' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ description: '联系人姓名' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiPropertyOptional({ description: '起送价', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: '配送日数组', example: [1, 3, 5] })
  @IsArray()
  @IsOptional()
  deliveryDays?: number[];

  @ApiPropertyOptional({ description: '配送模式', enum: DeliveryMode })
  @IsEnum(DeliveryMode)
  @IsOptional()
  deliveryMode?: DeliveryMode;

  @ApiPropertyOptional({
    description: '管理模式',
    enum: SupplierManagementMode,
  })
  @IsEnum(SupplierManagementMode)
  @IsOptional()
  managementMode?: SupplierManagementMode;

  @ApiPropertyOptional({ description: '是否有后台', default: true })
  @IsOptional()
  hasBackend?: boolean;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ description: '关联用户ID' })
  @IsInt()
  @IsOptional()
  userId?: number;
}

export class UpdateSupplierDto {
  @ApiPropertyOptional({ description: '供应商名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '门店端显示名称' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ description: '联系人姓名' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ description: '起送价' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: '配送日数组' })
  @IsArray()
  @IsOptional()
  deliveryDays?: number[];

  @ApiPropertyOptional({ description: '配送模式', enum: DeliveryMode })
  @IsEnum(DeliveryMode)
  @IsOptional()
  deliveryMode?: DeliveryMode;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateWebhookConfigDto {
  @ApiPropertyOptional({ description: '企业微信群Webhook地址' })
  @IsString()
  @IsOptional()
  wechatWebhookUrl?: string;

  @ApiPropertyOptional({ description: 'Webhook开关' })
  @IsOptional()
  webhookEnabled?: boolean;

  @ApiPropertyOptional({
    description: '推送事件配置',
    example: ['new_order', 'cancelled'],
  })
  @IsArray()
  @IsOptional()
  webhookEvents?: string[];
}

export class UpdateApiConfigDto {
  @ApiPropertyOptional({ description: 'API对接地址' })
  @IsString()
  @IsOptional()
  apiEndpoint?: string;

  @ApiPropertyOptional({
    description: '管理模式',
    enum: SupplierManagementMode,
  })
  @IsEnum(SupplierManagementMode)
  @IsOptional()
  managementMode?: SupplierManagementMode;
}

export class UpdateStatusDto {
  @ApiProperty({ description: '状态：1启用，0禁用' })
  @IsInt()
  @IsNotEmpty()
  status: number;
}

export class SupplierQueryDto {
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

  @ApiPropertyOptional({
    description: '管理模式筛选',
    enum: SupplierManagementMode,
  })
  @IsOptional()
  managementMode?: SupplierManagementMode;
}

export class DeliveryAreaDto {
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
}

export class BatchDeliveryAreaDto {
  @ApiProperty({ description: '配送区域列表', type: [DeliveryAreaDto] })
  @IsArray()
  @IsNotEmpty()
  areas: DeliveryAreaDto[];
}
