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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierMaterialService } from './supplier-material.service';
import {
  CreateSupplierMaterialDto,
  UpdateSupplierMaterialDto,
  SupplierMaterialQueryDto,
  UpdateStockStatusDto,
  AuditSupplierMaterialDto,
  BatchUpdatePriceDto,
} from './dto/supplier-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditStatus } from '../../entities/supplier-material.entity';

@ApiTags('供应商物料管理-管理员')
@ApiBearerAuth()
@Controller('admin/supplier-materials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminSupplierMaterialController {
  constructor(
    private readonly supplierMaterialService: SupplierMaterialService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建供应商物料报价' })
  @RequirePermissions('material')
  async create(@Body() dto: CreateSupplierMaterialDto) {
    return this.supplierMaterialService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取供应商物料报价列表' })
  @RequirePermissions('material')
  async findAll(@Query() query: SupplierMaterialQueryDto) {
    return this.supplierMaterialService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取供应商物料报价详情' })
  @RequirePermissions('material')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierMaterialService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新供应商物料报价' })
  @RequirePermissions('material')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierMaterialDto,
  ) {
    return this.supplierMaterialService.update(id, dto);
  }

  @Put(':id/audit')
  @ApiOperation({ summary: '审核供应商物料报价' })
  @RequirePermissions('product_audit')
  async audit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AuditSupplierMaterialDto,
  ) {
    return this.supplierMaterialService.audit(
      id,
      dto.auditStatus as AuditStatus,
      dto.rejectReason,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除供应商物料报价' })
  @RequirePermissions('material')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.supplierMaterialService.delete(id);
  }
}

@ApiTags('供应商物料管理-供应商')
@ApiBearerAuth()
@Controller('supplier/materials')
@UseGuards(JwtAuthGuard)
export class SupplierMaterialController {
  constructor(
    private readonly supplierMaterialService: SupplierMaterialService,
  ) {}

  @Post()
  @ApiOperation({ summary: '添加物料报价' })
  async create(
    @Request() req: { user: { supplierId: number } },
    @Body() dto: CreateSupplierMaterialDto,
  ) {
    dto.supplierId = req.user.supplierId;
    return this.supplierMaterialService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取我的物料报价列表' })
  async findAll(
    @Request() req: { user: { supplierId: number } },
    @Query() query: SupplierMaterialQueryDto,
  ) {
    query.supplierId = req.user.supplierId;
    return this.supplierMaterialService.findAll(query);
  }

  @Get('price-comparison')
  @ApiOperation({ summary: '获取价格对比统计' })
  async getPriceComparison(@Request() req: { user: { supplierId: number } }) {
    return this.supplierMaterialService.getPriceComparison(req.user.supplierId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取物料报价详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierMaterialService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新物料报价' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierMaterialDto,
  ) {
    return this.supplierMaterialService.update(id, dto);
  }

  @Put(':id/stock-status')
  @ApiOperation({ summary: '更新库存状态' })
  async updateStockStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockStatusDto,
  ) {
    return this.supplierMaterialService.updateStockStatus(id, dto.stockStatus);
  }

  @Post('batch-update-price')
  @ApiOperation({ summary: '批量调整价格' })
  async batchUpdatePrice(
    @Request() req: { user: { supplierId: number } },
    @Body() dto: BatchUpdatePriceDto,
  ) {
    return this.supplierMaterialService.batchUpdatePrice(
      req.user.supplierId,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除物料报价' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.supplierMaterialService.delete(id);
  }
}

@ApiTags('供应商物料查询-门店')
@ApiBearerAuth()
@Controller('store/supplier-materials')
@UseGuards(JwtAuthGuard)
export class StoreSupplierMaterialController {
  constructor(
    private readonly supplierMaterialService: SupplierMaterialService,
  ) {}

  @Get('sku/:skuId')
  @ApiOperation({ summary: '查询SKU的供应商报价列表' })
  async findByMaterialSku(@Param('skuId', ParseIntPipe) skuId: number) {
    return this.supplierMaterialService.findByMaterialSku(skuId);
  }

  @Get('supplier/:supplierId')
  @ApiOperation({ summary: '查询供应商的物料列表' })
  async findBySupplier(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.supplierMaterialService.findBySupplier(supplierId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取供应商物料详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supplierMaterialService.findOne(id);
  }
}
