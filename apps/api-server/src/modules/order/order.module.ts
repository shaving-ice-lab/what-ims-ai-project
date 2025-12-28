import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrderController,
  AdminOrderController,
  SupplierOrderController,
  StoreOrderController,
} from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderItem, OrderStatusLog, Store } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderStatusLog, Store]),
  ],
  controllers: [
    OrderController,
    AdminOrderController,
    SupplierOrderController,
    StoreOrderController,
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
