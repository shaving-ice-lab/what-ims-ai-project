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
import { MaterialService } from './material.service';
import {
  CreateMaterialDto,
  UpdateMaterialDto,
  MaterialQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UpdateStatusDto,
} from './dto/material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('分类管理')
@ApiBearerAuth()
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({ summary: '创建分类' })
  @RequirePermissions('material')
  async create(@Body() dto: CreateCategoryDto) {
    return this.materialService.createCategory(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  @RequirePermissions('material')
  async findAll() {
    return this.materialService.findAllCategories();
  }

  @Get('tree')
  @ApiOperation({ summary: '获取分类树' })
  @RequirePermissions('material')
  async findTree() {
    return this.materialService.findCategoryTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  @RequirePermissions('material')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOneCategory(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新分类' })
  @RequirePermissions('material')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.materialService.updateCategory(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  @RequirePermissions('material')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.deleteCategory(id);
  }
}

@ApiTags('物料管理')
@ApiBearerAuth()
@Controller('admin/materials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({ summary: '创建物料' })
  @RequirePermissions('material')
  async create(@Body() dto: CreateMaterialDto) {
    return this.materialService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取物料列表' })
  @RequirePermissions('material')
  async findAll(@Query() query: MaterialQueryDto) {
    return this.materialService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取物料详情' })
  @RequirePermissions('material')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新物料' })
  @RequirePermissions('material')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.materialService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新物料状态' })
  @RequirePermissions('material')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.materialService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除物料' })
  @RequirePermissions('material')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.delete(id);
  }
}

@ApiTags('物料管理-供应商')
@ApiBearerAuth()
@Controller('supplier/materials')
@UseGuards(JwtAuthGuard)
export class SupplierMaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  @ApiOperation({ summary: '获取物料列表' })
  async findAll(@Query() query: MaterialQueryDto) {
    return this.materialService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取物料详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }
}

@ApiTags('物料管理-门店')
@ApiBearerAuth()
@Controller('store/materials')
@UseGuards(JwtAuthGuard)
export class StoreMaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  @ApiOperation({ summary: '获取物料列表' })
  async findAll(@Query() query: MaterialQueryDto) {
    return this.materialService.findAll({ ...query, status: 1 });
  }

  @Get('categories')
  @ApiOperation({ summary: '获取分类树' })
  async findCategories() {
    return this.materialService.findCategoryTree();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取物料详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }
}
