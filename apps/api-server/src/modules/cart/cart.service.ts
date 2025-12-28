import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import Redis from 'ioredis';
import { MaterialSku, Supplier } from '../../entities';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartItem,
  SupplierCart,
  CartResponse,
} from './dto/cart.dto';

const CART_EXPIRE_DAYS = 30;
const CART_KEY_PREFIX = 'cart';

@Injectable()
export class CartService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    @InjectRepository(MaterialSku)
    private materialSkuRepository: Repository<MaterialSku>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  private getCartKey(storeId: number, supplierId: number): string {
    return `${CART_KEY_PREFIX}:${storeId}:${supplierId}`;
  }

  private getStoreCartPattern(storeId: number): string {
    return `${CART_KEY_PREFIX}:${storeId}:*`;
  }

  async addToCart(storeId: number, dto: AddToCartDto): Promise<CartItem> {
    const { supplierId, materialSkuId, quantity } = dto;

    // 验证SKU是否存在且属于该供应商
    const sku = await this.materialSkuRepository.findOne({
      where: { id: materialSkuId },
      relations: ['material'],
    });

    if (!sku) {
      throw new BadRequestException('商品不存在');
    }

    if (sku.material.supplierId !== supplierId) {
      throw new BadRequestException('商品不属于该供应商');
    }

    // 检查起订量
    if (quantity < sku.minOrderQty) {
      throw new BadRequestException(`最低起订量为 ${sku.minOrderQty}`);
    }

    // 检查步进量
    if ((quantity - sku.minOrderQty) % sku.stepQty !== 0) {
      throw new BadRequestException(`数量需按 ${sku.stepQty} 的倍数递增`);
    }

    const cartKey = this.getCartKey(storeId, supplierId);
    const field = String(materialSkuId);

    // 获取现有购物车项
    const existingItem = await this.redis.hget(cartKey, field);
    let cartItem: CartItem;

    if (existingItem) {
      // 更新数量
      cartItem = JSON.parse(existingItem) as CartItem;
      cartItem.quantity = quantity;
      cartItem.price = sku.salePrice;
    } else {
      // 新增购物车项
      cartItem = {
        materialSkuId,
        quantity,
        addedAt: new Date().toISOString(),
        price: sku.salePrice,
        materialName: sku.material.name,
        brand: sku.material.brand,
        spec: sku.material.spec,
        unit: sku.material.unit,
        imageUrl: sku.image || (sku.material.images?.[0] ?? undefined),
      };
    }

    await this.redis.hset(cartKey, field, JSON.stringify(cartItem));
    await this.redis.expire(cartKey, CART_EXPIRE_DAYS * 24 * 60 * 60);

    return cartItem;
  }

  async updateQuantity(
    storeId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartItem | null> {
    const { supplierId, materialSkuId, quantity } = dto;

    if (quantity === 0) {
      await this.removeItem(storeId, supplierId, materialSkuId);
      return null;
    }

    const cartKey = this.getCartKey(storeId, supplierId);
    const field = String(materialSkuId);

    const existingItem = await this.redis.hget(cartKey, field);
    if (!existingItem) {
      throw new BadRequestException('购物车中不存在该商品');
    }

    // 验证SKU
    const sku = await this.materialSkuRepository.findOne({
      where: { id: materialSkuId },
    });

    if (!sku) {
      throw new BadRequestException('商品不存在');
    }

    // 检查起订量和步进量
    if (quantity < sku.minOrderQty) {
      throw new BadRequestException(`最低起订量为 ${sku.minOrderQty}`);
    }

    if ((quantity - sku.minOrderQty) % sku.stepQty !== 0) {
      throw new BadRequestException(`数量需按 ${sku.stepQty} 的倍数递增`);
    }

    const cartItem = JSON.parse(existingItem) as CartItem;
    cartItem.quantity = quantity;
    cartItem.price = sku.salePrice;

    await this.redis.hset(cartKey, field, JSON.stringify(cartItem));
    await this.redis.expire(cartKey, CART_EXPIRE_DAYS * 24 * 60 * 60);

    return cartItem;
  }

  async removeItem(
    storeId: number,
    supplierId: number,
    materialSkuId: number,
  ): Promise<void> {
    const cartKey = this.getCartKey(storeId, supplierId);
    await this.redis.hdel(cartKey, String(materialSkuId));
  }

  async getCart(storeId: number): Promise<CartResponse> {
    const pattern = this.getStoreCartPattern(storeId);
    const keys = await this.redis.keys(pattern);

    const supplierCarts: SupplierCart[] = [];
    let totalItemCount = 0;
    let totalAmount = 0;

    for (const key of keys) {
      // 从key中提取supplierId
      const parts = key.split(':');
      const supplierId = parseInt(parts[2], 10);

      // 获取该供应商购物车中的所有商品
      const items = await this.redis.hgetall(key);
      const cartItems: CartItem[] = Object.values(items).map(
        (item) => JSON.parse(item) as CartItem,
      );

      if (cartItems.length === 0) continue;

      // 获取供应商信息
      const supplier = await this.supplierRepository.findOne({
        where: { id: supplierId },
      });

      // 计算小计
      let cartTotalAmount = 0;
      for (const item of cartItems) {
        cartTotalAmount += (item.price || 0) * item.quantity;
      }

      const supplierCart: SupplierCart = {
        supplierId,
        supplierName: supplier?.displayName || supplier?.name,
        minOrderAmount: supplier?.minOrderAmount,
        items: cartItems,
        totalAmount: cartTotalAmount,
        itemCount: cartItems.length,
      };

      supplierCarts.push(supplierCart);
      totalItemCount += cartItems.length;
      totalAmount += cartTotalAmount;
    }

    return {
      storeId,
      supplierCarts,
      totalItemCount,
      totalAmount,
    };
  }

  async getSupplierCart(
    storeId: number,
    supplierId: number,
  ): Promise<SupplierCart | null> {
    const cartKey = this.getCartKey(storeId, supplierId);
    const items = await this.redis.hgetall(cartKey);

    if (Object.keys(items).length === 0) {
      return null;
    }

    const cartItems: CartItem[] = Object.values(items).map(
      (item) => JSON.parse(item) as CartItem,
    );

    // 获取供应商信息
    const supplier = await this.supplierRepository.findOne({
      where: { id: supplierId },
    });

    // 计算小计
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += (item.price || 0) * item.quantity;
    }

    return {
      supplierId,
      supplierName: supplier?.displayName || supplier?.name,
      minOrderAmount: supplier?.minOrderAmount,
      items: cartItems,
      totalAmount,
      itemCount: cartItems.length,
    };
  }

  async clearCart(storeId: number, supplierId?: number): Promise<void> {
    if (supplierId) {
      // 清空指定供应商购物车
      const cartKey = this.getCartKey(storeId, supplierId);
      await this.redis.del(cartKey);
    } else {
      // 清空所有购物车
      const pattern = this.getStoreCartPattern(storeId);
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }

  async getCartCount(storeId: number): Promise<number> {
    const pattern = this.getStoreCartPattern(storeId);
    const keys = await this.redis.keys(pattern);

    let count = 0;
    for (const key of keys) {
      count += await this.redis.hlen(key);
    }

    return count;
  }

  async refreshCartPrices(storeId: number): Promise<void> {
    const pattern = this.getStoreCartPattern(storeId);
    const keys = await this.redis.keys(pattern);

    for (const key of keys) {
      const items = await this.redis.hgetall(key);
      const skuIds = Object.keys(items).map((id) => parseInt(id, 10));

      if (skuIds.length === 0) continue;

      // 批量获取最新价格
      const skus = await this.materialSkuRepository.find({
        where: { id: In(skuIds) },
      });

      const skuMap = new Map(skus.map((sku) => [sku.id, sku]));

      // 更新价格
      for (const [field, value] of Object.entries(items)) {
        const cartItem = JSON.parse(value) as CartItem;
        const sku = skuMap.get(cartItem.materialSkuId);
        if (sku) {
          cartItem.price = sku.salePrice;
          await this.redis.hset(key, field, JSON.stringify(cartItem));
        }
      }
    }
  }
}
