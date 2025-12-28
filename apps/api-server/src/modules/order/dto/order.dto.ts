import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  OrderStatus,
  PaymentStatus,
  OrderSource,
} from '../../../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({ description: '物料SKU ID' })
  @IsInt()
  @IsNotEmpty()
  materialSkuId: number;

  @ApiProperty({ description: '数量' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @ApiProperty({ description: '订单商品列表', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ description: '配送省' })
  @IsString()
  @IsOptional()
  deliveryProvince?: string;

  @ApiPropertyOptional({ description: '配送市' })
  @IsString()
  @IsOptional()
  deliveryCity?: string;

  @ApiPropertyOptional({ description: '配送区' })
  @IsString()
  @IsOptional()
  deliveryDistrict?: string;

  @ApiPropertyOptional({ description: '配送详细地址' })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiPropertyOptional({ description: '配送联系人' })
  @IsString()
  @IsOptional()
  deliveryContact?: string;

  @ApiPropertyOptional({ description: '配送电话' })
  @IsString()
  @IsOptional()
  deliveryPhone?: string;

  @ApiPropertyOptional({ description: '期望配送日期' })
  @IsOptional()
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ description: '订单来源', enum: OrderSource })
  @IsEnum(OrderSource)
  @IsOptional()
  orderSource?: OrderSource;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: '订单状态', enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class ConfirmOrderDto {
  @ApiPropertyOptional({ description: '供应商备注' })
  @IsString()
  @IsOptional()
  supplierRemark?: string;
}

export class CancelOrderDto {
  @ApiProperty({ description: '取消原因' })
  @IsString()
  @IsNotEmpty()
  cancelReason: string;
}

export class OrderQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: '订单号' })
  @IsOptional()
  orderNo?: string;

  @ApiPropertyOptional({ description: '门店ID' })
  @IsOptional()
  @Type(() => Number)
  storeId?: number;

  @ApiPropertyOptional({ description: '供应商ID' })
  @IsOptional()
  @Type(() => Number)
  supplierId?: number;

  @ApiPropertyOptional({ description: '订单状态', enum: OrderStatus })
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ description: '支付状态', enum: PaymentStatus })
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  endDate?: string;
}

export class AdminOrderQueryDto extends OrderQueryDto {
  @ApiPropertyOptional({ description: '搜索关键词（订单号/门店名/供应商名）' })
  @IsOptional()
  keyword?: string;
}
