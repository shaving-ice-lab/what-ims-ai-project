import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PriceMarkupController,
  StorePriceMarkupController,
} from './price-markup.controller';
import { PriceMarkupService } from './price-markup.service';
import { PriceMarkup } from '../../entities/price-markup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceMarkup])],
  controllers: [PriceMarkupController, StorePriceMarkupController],
  providers: [PriceMarkupService],
  exports: [PriceMarkupService],
})
export class PriceMarkupModule {}
