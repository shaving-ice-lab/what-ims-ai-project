import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminSupplierMaterialController,
  SupplierMaterialController,
  StoreSupplierMaterialController,
} from './supplier-material.controller';
import { SupplierMaterialService } from './supplier-material.service';
import { SupplierMaterial } from '../../entities/supplier-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierMaterial])],
  controllers: [
    AdminSupplierMaterialController,
    SupplierMaterialController,
    StoreSupplierMaterialController,
  ],
  providers: [SupplierMaterialService],
  exports: [SupplierMaterialService],
})
export class SupplierMaterialModule {}
