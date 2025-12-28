import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderQueryDto,
  AdminOrderQueryDto,
  ConfirmOrderDto,
  CancelOrderDto,
} from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('订单管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}

@ApiTags('订单管理-管理员')
@ApiBearerAuth()
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @RequirePermissions('order')
  async findAll(@Query() query: AdminOrderQueryDto) {
    return this.orderService.findAllForAdmin(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取订单统计' })
  @RequirePermissions('order')
  async getStats() {
    return this.orderService.getOrderStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  @RequirePermissions('order')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: '获取订单状态日志' })
  @RequirePermissions('order')
  async getStatusLogs(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getStatusLogs(id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '管理员取消订单' })
  @RequirePermissions('order')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
    @Request() req: any,
  ) {
    return this.orderService.cancelByAdmin(id, req.user.userId, dto);
  }
}

@ApiTags('订单管理-供应商')
@ApiBearerAuth()
@Controller('supplier/orders')
@UseGuards(JwtAuthGuard)
export class SupplierOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  async findAll(@Query() query: OrderQueryDto, @Request() req: any) {
    return this.orderService.findAll({ ...query, supplierId: req.user.roleId });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取订单统计' })
  async getStats(@Request() req: any) {
    return this.orderService.getOrderStats(req.user.roleId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: '获取订单状态日志' })
  async getStatusLogs(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getStatusLogs(id);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: '确认订单' })
  async confirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmOrderDto,
    @Request() req: any,
  ) {
    return this.orderService.confirm(id, req.user.roleId, dto);
  }

  @Put(':id/deliver')
  @ApiOperation({ summary: '开始配送' })
  async startDelivery(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.orderService.startDelivery(id, req.user.roleId);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: '完成订单' })
  async complete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.orderService.complete(id, req.user.roleId);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
    @Request() req: any,
  ) {
    return this.orderService.cancelBySupplier(id, req.user.roleId, dto);
  }
}

@ApiTags('订单管理-门店')
@ApiBearerAuth()
@Controller('store/orders')
@UseGuards(JwtAuthGuard)
export class StoreOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(req.user.roleId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  async findAll(@Query() query: OrderQueryDto, @Request() req: any) {
    return this.orderService.findAll({ ...query, storeId: req.user.roleId });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取订单统计' })
  async getStats(@Request() req: any) {
    return this.orderService.getOrderStats(undefined, req.user.roleId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: '获取订单状态日志' })
  async getStatusLogs(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getStatusLogs(id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
    @Request() req: any,
  ) {
    return this.orderService.cancelByStore(id, req.user.roleId, dto);
  }
}
