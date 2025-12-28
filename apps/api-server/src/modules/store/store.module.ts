import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
