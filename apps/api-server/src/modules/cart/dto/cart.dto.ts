import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsPositive()
  supplierId: number;

  @ApiProperty({ description: '物料SKU ID' })
  @IsInt()
  @IsPositive()
  materialSkuId: number;

  @ApiProperty({ description: '数量', minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsPositive()
  supplierId: number;

  @ApiProperty({ description: '物料SKU ID' })
  @IsInt()
  @IsPositive()
  materialSkuId: number;

  @ApiProperty({ description: '数量', minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class RemoveCartItemDto {
  @ApiProperty({ description: '供应商ID' })
  @IsInt()
  @IsPositive()
  supplierId: number;

  @ApiProperty({ description: '物料SKU ID' })
  @IsInt()
  @IsPositive()
  materialSkuId: number;
}

export class ClearCartDto {
  @ApiPropertyOptional({ description: '供应商ID，不传则清空所有' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  supplierId?: number;
}

export interface CartItem {
  materialSkuId: number;
  quantity: number;
  addedAt: string;
  price?: number;
  materialName?: string;
  brand?: string;
  spec?: string;
  unit?: string;
  imageUrl?: string;
}

export interface SupplierCart {
  supplierId: number;
  supplierName?: string;
  minOrderAmount?: number;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface CartResponse {
  storeId: number;
  supplierCarts: SupplierCart[];
  totalItemCount: number;
  totalAmount: number;
}
