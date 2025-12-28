import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';

import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StoreModule } from './modules/store/store.module';
import { OrderModule } from './modules/order/order.module';
import { MaterialModule } from './modules/material/material.module';
import { MaterialSkuModule } from './modules/material-sku/material-sku.module';
import { SupplierMaterialModule } from './modules/supplier-material/supplier-material.module';
import { PriceMarkupModule } from './modules/price-markup/price-markup.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // 速率限制模块
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('throttle.ttl') || 60,
            limit: configService.get<number>('throttle.limit') || 100,
          },
        ],
      }),
    }),

    // 业务模块
    AuthModule,
    AdminModule,
    SupplierModule,
    StoreModule,
    OrderModule,
    MaterialModule,
    MaterialSkuModule,
    SupplierMaterialModule,
    PriceMarkupModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
