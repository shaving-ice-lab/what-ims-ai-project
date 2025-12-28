import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MaterialSkuController,
  SupplierMaterialSkuController,
  StoreMaterialSkuController,
} from './material-sku.controller';
import { MaterialSkuService } from './material-sku.service';
import { MaterialSku } from '../../entities/material-sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialSku])],
  controllers: [
    MaterialSkuController,
    SupplierMaterialSkuController,
    StoreMaterialSkuController,
  ],
  providers: [MaterialSkuService],
  exports: [MaterialSkuService],
})
export class MaterialSkuModule {}
