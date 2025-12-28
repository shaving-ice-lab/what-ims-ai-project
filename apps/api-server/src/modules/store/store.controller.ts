import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  UpdateMarkupDto,
  UpdateStatusDto,
  StoreQueryDto,
} from './dto/store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('门店管理')
@ApiBearerAuth()
@Controller('admin/stores')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: '创建门店' })
  @RequirePermissions('store')
  async create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取门店列表' })
  @RequirePermissions('store')
  async findAll(@Query() query: StoreQueryDto) {
    return this.storeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取门店详情' })
  @RequirePermissions('store')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新门店信息' })
  @RequirePermissions('store')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, dto);
  }

  @Put(':id/markup')
  @ApiOperation({ summary: '更新加价开关' })
  @RequirePermissions('store')
  async updateMarkup(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMarkupDto,
  ) {
    return this.storeService.updateMarkup(id, dto.markupEnabled);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '启用/禁用门店' })
  @RequirePermissions('store')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.storeService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除门店' })
  @RequirePermissions('store')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.storeService.delete(id);
    return { message: '删除成功' };
  }
}
