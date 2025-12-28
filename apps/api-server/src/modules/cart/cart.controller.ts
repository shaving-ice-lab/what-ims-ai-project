import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  RemoveCartItemDto,
  ClearCartDto,
  CartResponse,
  CartItem,
  SupplierCart,
} from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  CurrentUser,
  JwtPayload,
} from '../auth/decorators/current-user.decorator';

@ApiTags('购物车')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('store')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: '添加商品到购物车' })
  @ApiResponse({ status: 201, description: '添加成功' })
  async addToCart(
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddToCartDto,
  ): Promise<CartItem> {
    return this.cartService.addToCart(user.roleId!, dto);
  }

  @Put('update')
  @ApiOperation({ summary: '更新购物车商品数量' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateQuantity(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItem | null> {
    return this.cartService.updateQuantity(user.roleId!, dto);
  }

  @Delete('remove')
  @ApiOperation({ summary: '删除购物车商品' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeItem(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RemoveCartItemDto,
  ): Promise<{ message: string }> {
    await this.cartService.removeItem(
      user.roleId!,
      dto.supplierId,
      dto.materialSkuId,
    );
    return { message: '删除成功' };
  }

  @Get()
  @ApiOperation({ summary: '获取购物车列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getCart(@CurrentUser() user: JwtPayload): Promise<CartResponse> {
    return this.cartService.getCart(user.roleId!);
  }

  @Get('supplier/:supplierId')
  @ApiOperation({ summary: '获取指定供应商购物车' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getSupplierCart(
    @CurrentUser() user: JwtPayload,
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<SupplierCart | null> {
    return this.cartService.getSupplierCart(user.roleId!, supplierId);
  }

  @Delete('clear')
  @ApiOperation({ summary: '清空购物车' })
  @ApiResponse({ status: 200, description: '清空成功' })
  async clearCart(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ClearCartDto,
  ): Promise<{ message: string }> {
    await this.cartService.clearCart(user.roleId!, dto.supplierId);
    return { message: '清空成功' };
  }

  @Get('count')
  @ApiOperation({ summary: '获取购物车商品数量' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getCartCount(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ count: number }> {
    const count = await this.cartService.getCartCount(user.roleId!);
    return { count };
  }

  @Post('refresh-prices')
  @ApiOperation({ summary: '刷新购物车商品价格' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  async refreshPrices(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.cartService.refreshCartPrices(user.roleId!);
    return { message: '价格已刷新' };
  }
}
