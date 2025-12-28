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
import { MaterialSkuService } from './material-sku.service';
import {
  CreateMaterialSkuDto,
  UpdateMaterialSkuDto,
  MaterialSkuQueryDto,
  UpdateSkuStatusDto,
} from './dto/material-sku.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('物料SKU管理')
@ApiBearerAuth()
@Controller('admin/material-skus')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialSkuController {
  constructor(private readonly materialSkuService: MaterialSkuService) {}

  @Post()
  @ApiOperation({ summary: '创建SKU' })
  @RequirePermissions('material')
  async create(@Body() dto: CreateMaterialSkuDto) {
    return this.materialSkuService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取SKU列表' })
  @RequirePermissions('material')
  async findAll(@Query() query: MaterialSkuQueryDto) {
    return this.materialSkuService.findAll(query);
  }

  @Get('brands')
  @ApiOperation({ summary: '获取所有品牌' })
  @RequirePermissions('material')
  async getBrands() {
    return this.materialSkuService.getBrands();
  }

  @Get('material/:materialId')
  @ApiOperation({ summary: '按物料ID获取SKU列表' })
  @RequirePermissions('material')
  async findByMaterial(@Param('materialId', ParseIntPipe) materialId: number) {
    return this.materialSkuService.findByMaterial(materialId);
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: '按条码查询SKU' })
  @RequirePermissions('material')
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.materialSkuService.findByBarcode(barcode);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取SKU详情' })
  @RequirePermissions('material')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialSkuService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新SKU' })
  @RequirePermissions('material')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialSkuDto,
  ) {
    return this.materialSkuService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新SKU状态' })
  @RequirePermissions('material')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkuStatusDto,
  ) {
    return this.materialSkuService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除SKU' })
  @RequirePermissions('material')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialSkuService.delete(id);
  }
}

@ApiTags('物料SKU-供应商')
@ApiBearerAuth()
@Controller('supplier/material-skus')
@UseGuards(JwtAuthGuard)
export class SupplierMaterialSkuController {
  constructor(private readonly materialSkuService: MaterialSkuService) {}

  @Get()
  @ApiOperation({ summary: '获取SKU列表' })
  async findAll(@Query() query: MaterialSkuQueryDto) {
    return this.materialSkuService.findAll({ ...query, status: 1 });
  }

  @Get('brands')
  @ApiOperation({ summary: '获取所有品牌' })
  async getBrands() {
    return this.materialSkuService.getBrands();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取SKU详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialSkuService.findOne(id);
  }
}

@ApiTags('物料SKU-门店')
@ApiBearerAuth()
@Controller('store/material-skus')
@UseGuards(JwtAuthGuard)
export class StoreMaterialSkuController {
  constructor(private readonly materialSkuService: MaterialSkuService) {}

  @Get()
  @ApiOperation({ summary: '获取SKU列表' })
  async findAll(@Query() query: MaterialSkuQueryDto) {
    return this.materialSkuService.findAll({ ...query, status: 1 });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取SKU详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialSkuService.findOne(id);
  }
}
