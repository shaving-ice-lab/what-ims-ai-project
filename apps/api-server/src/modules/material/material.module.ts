import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CategoryController,
  MaterialController,
  SupplierMaterialController,
  StoreMaterialController,
} from './material.controller';
import { MaterialService } from './material.service';
import { Material, Category } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Category])],
  controllers: [
    CategoryController,
    MaterialController,
    SupplierMaterialController,
    StoreMaterialController,
  ],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
