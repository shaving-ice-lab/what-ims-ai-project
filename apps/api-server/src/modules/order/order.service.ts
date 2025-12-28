import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  CancelledByType,
} from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import {
  OrderStatusLog,
  OperatorType,
} from '../../entities/order-status-log.entity';
import { Store } from '../../entities/store.entity';
import {
  CreateOrderDto,
  OrderQueryDto,
  AdminOrderQueryDto,
  ConfirmOrderDto,
  CancelOrderDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusLog)
    private orderStatusLogRepository: Repository<OrderStatusLog>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  private generateOrderNo(): string {
    const now = new Date();
    const dateStr = now
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${dateStr}${random}`;
  }

  async create(storeId: number, dto: CreateOrderDto): Promise<Order> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    const order = this.orderRepository.create({
      orderNo: this.generateOrderNo(),
      storeId,
      supplierId: dto.supplierId,
      goodsAmount: 0,
      serviceFee: 0,
      totalAmount: 0,
      supplierAmount: 0,
      markupTotal: 0,
      itemCount: dto.items.length,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.UNPAID,
      orderSource: dto.orderSource,
      deliveryProvince: dto.deliveryProvince || store.province,
      deliveryCity: dto.deliveryCity || store.city,
      deliveryDistrict: dto.deliveryDistrict || store.district,
      deliveryAddress: dto.deliveryAddress || store.address,
      deliveryContact: dto.deliveryContact || store.contactName,
      deliveryPhone: dto.deliveryPhone || store.contactPhone,
      expectedDeliveryDate: dto.expectedDeliveryDate,
      remark: dto.remark,
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.logStatusChange(
      savedOrder.id,
      null,
      OrderStatus.PENDING_PAYMENT,
      OperatorType.STORE,
      storeId,
      '创建订单',
    );

    return savedOrder;
  }

  async findAll(query: OrderQueryDto): Promise<{
    items: Order[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      orderNo,
      storeId,
      supplierId,
      status,
      paymentStatus,
      startDate,
      endDate,
    } = query;

    const qb = this.orderRepository.createQueryBuilder('order');
    qb.leftJoinAndSelect('order.store', 'store');
    qb.leftJoinAndSelect('order.supplier', 'supplier');

    if (orderNo) {
      qb.andWhere('order.orderNo LIKE :orderNo', { orderNo: `%${orderNo}%` });
    }

    if (storeId) {
      qb.andWhere('order.storeId = :storeId', { storeId });
    }

    if (supplierId) {
      qb.andWhere('order.supplierId = :supplierId', { supplierId });
    }

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (startDate && endDate) {
      qb.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate + ' 23:59:59'),
      });
    } else if (startDate) {
      qb.andWhere('order.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      qb.andWhere('order.createdAt <= :endDate', {
        endDate: new Date(endDate + ' 23:59:59'),
      });
    }

    qb.orderBy('order.createdAt', 'DESC');

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findAllForAdmin(query: AdminOrderQueryDto): Promise<{
    items: Order[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { keyword, ...restQuery } = query;

    const qb = this.orderRepository.createQueryBuilder('order');
    qb.leftJoinAndSelect('order.store', 'store');
    qb.leftJoinAndSelect('order.supplier', 'supplier');

    if (keyword) {
      qb.andWhere(
        '(order.orderNo LIKE :keyword OR store.name LIKE :keyword OR supplier.name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (restQuery.storeId) {
      qb.andWhere('order.storeId = :storeId', { storeId: restQuery.storeId });
    }

    if (restQuery.supplierId) {
      qb.andWhere('order.supplierId = :supplierId', {
        supplierId: restQuery.supplierId,
      });
    }

    if (restQuery.status) {
      qb.andWhere('order.status = :status', { status: restQuery.status });
    }

    if (restQuery.paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: restQuery.paymentStatus,
      });
    }

    if (restQuery.startDate && restQuery.endDate) {
      qb.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(restQuery.startDate),
        endDate: new Date(restQuery.endDate + ' 23:59:59'),
      });
    }

    qb.orderBy('order.createdAt', 'DESC');

    const page = restQuery.page || 1;
    const pageSize = restQuery.pageSize || 10;

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['store', 'supplier', 'items'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  async findByOrderNo(orderNo: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNo },
      relations: ['store', 'supplier', 'items'],
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  async confirm(
    id: number,
    supplierId: number,
    dto: ConfirmOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (order.supplierId !== supplierId) {
      throw new BadRequestException('无权操作此订单');
    }

    if (order.status !== OrderStatus.PENDING_CONFIRM) {
      throw new BadRequestException('订单状态不允许确认');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.CONFIRMED;
    order.confirmedAt = new Date();
    if (dto.supplierRemark) {
      order.supplierRemark = dto.supplierRemark;
    }

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.CONFIRMED,
      OperatorType.SUPPLIER,
      supplierId,
      '供应商确认订单',
    );

    return order;
  }

  async startDelivery(id: number, supplierId: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.supplierId !== supplierId) {
      throw new BadRequestException('无权操作此订单');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('订单状态不允许开始配送');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.DELIVERING;
    order.deliveringAt = new Date();

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.DELIVERING,
      OperatorType.SUPPLIER,
      supplierId,
      '开始配送',
    );

    return order;
  }

  async complete(id: number, supplierId: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.supplierId !== supplierId) {
      throw new BadRequestException('无权操作此订单');
    }

    if (order.status !== OrderStatus.DELIVERING) {
      throw new BadRequestException('订单状态不允许完成');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    order.actualDeliveryTime = new Date();

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.COMPLETED,
      OperatorType.SUPPLIER,
      supplierId,
      '订单完成',
    );

    return order;
  }

  async cancelByStore(
    id: number,
    storeId: number,
    dto: CancelOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (order.storeId !== storeId) {
      throw new BadRequestException('无权操作此订单');
    }

    const allowedStatuses = [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PENDING_CONFIRM,
    ];
    if (!allowedStatuses.includes(order.status)) {
      throw new BadRequestException('订单状态不允许取消，请联系客服');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.CANCELLED;
    order.cancelReason = dto.cancelReason;
    order.cancelledBy = CancelledByType.STORE;
    order.cancelledById = storeId;
    order.cancelledAt = new Date();

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.CANCELLED,
      OperatorType.STORE,
      storeId,
      `门店取消订单：${dto.cancelReason}`,
    );

    return order;
  }

  async cancelBySupplier(
    id: number,
    supplierId: number,
    dto: CancelOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (order.supplierId !== supplierId) {
      throw new BadRequestException('无权操作此订单');
    }

    const allowedStatuses = [
      OrderStatus.PENDING_CONFIRM,
      OrderStatus.CONFIRMED,
    ];
    if (!allowedStatuses.includes(order.status)) {
      throw new BadRequestException('订单状态不允许取消');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.CANCELLED;
    order.cancelReason = dto.cancelReason;
    order.cancelledBy = CancelledByType.SUPPLIER;
    order.cancelledById = supplierId;
    order.cancelledAt = new Date();

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.CANCELLED,
      OperatorType.SUPPLIER,
      supplierId,
      `供应商取消订单：${dto.cancelReason}`,
    );

    return order;
  }

  async cancelByAdmin(
    id: number,
    adminId: number,
    dto: CancelOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException('订单状态不允许取消');
    }

    const oldStatus = order.status;
    order.status = OrderStatus.CANCELLED;
    order.cancelReason = dto.cancelReason;
    order.cancelledBy = CancelledByType.ADMIN;
    order.cancelledById = adminId;
    order.cancelledAt = new Date();

    await this.orderRepository.save(order);
    await this.logStatusChange(
      id,
      oldStatus,
      OrderStatus.CANCELLED,
      OperatorType.ADMIN,
      adminId,
      `管理员取消订单：${dto.cancelReason}`,
    );

    return order;
  }

  async getStatusLogs(orderId: number): Promise<OrderStatusLog[]> {
    return this.orderStatusLogRepository.find({
      where: { orderId },
      order: { createdAt: 'ASC' },
    });
  }

  private async logStatusChange(
    orderId: number,
    fromStatus: OrderStatus | null,
    toStatus: OrderStatus,
    operatorType: OperatorType,
    operatorId: number,
    remark?: string,
  ): Promise<void> {
    const log = this.orderStatusLogRepository.create({
      orderId,
      fromStatus: fromStatus || undefined,
      toStatus,
      operatorType,
      operatorId,
      remark,
    });
    await this.orderStatusLogRepository.save(log);
  }

  async getOrderStats(
    supplierId?: number,
    storeId?: number,
  ): Promise<{
    pendingConfirm: number;
    delivering: number;
    todayOrders: number;
    todayAmount: number;
  }> {
    const qb = this.orderRepository.createQueryBuilder('order');

    if (supplierId) {
      qb.andWhere('order.supplierId = :supplierId', { supplierId });
    }

    if (storeId) {
      qb.andWhere('order.storeId = :storeId', { storeId });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingConfirm = await qb
      .clone()
      .andWhere('order.status = :status', {
        status: OrderStatus.PENDING_CONFIRM,
      })
      .getCount();

    const delivering = await qb
      .clone()
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERING })
      .getCount();

    const todayOrders = await qb
      .clone()
      .andWhere('order.createdAt >= :today', { today })
      .getCount();

    const todayAmountResult = await qb
      .clone()
      .select('SUM(order.totalAmount)', 'total')
      .andWhere('order.createdAt >= :today', { today })
      .andWhere('order.paymentStatus = :paid', { paid: PaymentStatus.PAID })
      .getRawOne();

    return {
      pendingConfirm,
      delivering,
      todayOrders,
      todayAmount: parseFloat(todayAmountResult?.total || '0'),
    };
  }
}
