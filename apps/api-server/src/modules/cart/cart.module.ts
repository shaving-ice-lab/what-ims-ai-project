import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MaterialSku, Supplier } from '../../entities';
import { RedisModule } from '../../shared/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialSku, Supplier]), RedisModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
