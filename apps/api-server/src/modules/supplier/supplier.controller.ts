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
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  UpdateWebhookConfigDto,
  UpdateApiConfigDto,
  UpdateStatusDto,
  SupplierQueryDto,
  DeliveryAreaDto,
  BatchDeliveryAreaDto,
} from './dto/supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('供应商管理')
@ApiBearerAuth()
@Controller('admin/suppliers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ summary: '创建供应商' })
  @RequirePermissions('supplier')
  async create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取供应商列表' })
  @RequirePermissions('supplier')
  async findAll(@Query() query: SupplierQueryDto) {
    return this.supplierService.findAll(query);
  }

  @Get('managed')
  @ApiOperation({ summary: '获取代管供应商列表' })
  @RequirePermissions('supplier')
  async findManaged() {
    return this.supplierService.findByManagementMode('managed');
  }

  @Get(':id')
  @ApiOperation({ summary: '获取供应商详情' })
  @RequirePermissions('supplier')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新供应商信息' })
  @RequirePermissions('supplier')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, dto);
  }

  @Put(':id/webhook')
  @ApiOperation({ summary: '更新Webhook配置' })
  @RequirePermissions('supplier')
  async updateWebhook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWebhookConfigDto,
  ) {
    return this.supplierService.updateWebhookConfig(id, dto);
  }

  @Put(':id/api-config')
  @ApiOperation({ summary: '更新API配置' })
  @RequirePermissions('supplier')
  async updateApiConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApiConfigDto,
  ) {
    return this.supplierService.updateApiConfig(id, dto);
  }

  @Post(':id/regenerate-secret')
  @ApiOperation({ summary: '重新生成API密钥' })
  @RequirePermissions('supplier')
  async regenerateSecret(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.regenerateApiSecret(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '启用/禁用供应商' })
  @RequirePermissions('supplier')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.supplierService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除供应商' })
  @RequirePermissions('supplier')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.supplierService.delete(id);
    return { message: '删除成功' };
  }

  @Get(':id/delivery-areas')
  @ApiOperation({ summary: '获取配送区域' })
  @RequirePermissions('supplier')
  async getDeliveryAreas(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.getDeliveryAreas(id);
  }

  @Put(':id/delivery-areas')
  @ApiOperation({ summary: '批量设置配送区域' })
  @RequirePermissions('supplier')
  async setDeliveryAreas(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BatchDeliveryAreaDto,
  ) {
    return this.supplierService.setDeliveryAreas(id, dto.areas);
  }

  @Post(':id/delivery-areas')
  @ApiOperation({ summary: '添加配送区域' })
  @RequirePermissions('supplier')
  async addDeliveryArea(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DeliveryAreaDto,
  ) {
    return this.supplierService.addDeliveryArea(id, dto);
  }

  @Delete(':id/delivery-areas/:areaId')
  @ApiOperation({ summary: '删除配送区域' })
  @RequirePermissions('supplier')
  async removeDeliveryArea(
    @Param('id', ParseIntPipe) id: number,
    @Param('areaId', ParseIntPipe) areaId: number,
  ) {
    await this.supplierService.removeDeliveryArea(id, areaId);
    return { message: '删除成功' };
  }
}
