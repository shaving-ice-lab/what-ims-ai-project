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
import { PriceMarkupService } from './price-markup.service';
import {
  CreatePriceMarkupDto,
  UpdatePriceMarkupDto,
  PriceMarkupQueryDto,
  UpdateMarkupStatusDto,
  CalculateMarkupDto,
} from './dto/price-markup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('加价规则管理')
@ApiBearerAuth()
@Controller('admin/price-markups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PriceMarkupController {
  constructor(private readonly priceMarkupService: PriceMarkupService) {}

  @Post()
  @ApiOperation({ summary: '创建加价规则' })
  @RequirePermissions('price_markup')
  async create(
    @Request() req: { user: { id: number } },
    @Body() dto: CreatePriceMarkupDto,
  ) {
    return this.priceMarkupService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取加价规则列表' })
  @RequirePermissions('price_markup')
  async findAll(@Query() query: PriceMarkupQueryDto) {
    return this.priceMarkupService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: '获取所有生效中的规则' })
  @RequirePermissions('price_markup')
  async getActiveRules() {
    return this.priceMarkupService.getActiveRules();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取加价规则详情' })
  @RequirePermissions('price_markup')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.priceMarkupService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新加价规则' })
  @RequirePermissions('price_markup')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceMarkupDto,
  ) {
    return this.priceMarkupService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '更新规则状态' })
  @RequirePermissions('price_markup')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMarkupStatusDto,
  ) {
    return this.priceMarkupService.updateStatus(id, dto.isActive);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除加价规则' })
  @RequirePermissions('price_markup')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.priceMarkupService.delete(id);
  }

  @Post('calculate')
  @ApiOperation({ summary: '计算加价后价格' })
  @RequirePermissions('price_markup')
  async calculateMarkup(@Body() dto: CalculateMarkupDto) {
    return this.priceMarkupService.calculateMarkup(dto);
  }
}

@ApiTags('加价规则-门店')
@ApiBearerAuth()
@Controller('store/price-markups')
@UseGuards(JwtAuthGuard)
export class StorePriceMarkupController {
  constructor(private readonly priceMarkupService: PriceMarkupService) {}

  @Post('calculate')
  @ApiOperation({ summary: '计算门店加价后价格' })
  async calculateMarkup(
    @Request() req: { user: { storeId: number } },
    @Body() dto: CalculateMarkupDto,
  ) {
    dto.storeId = req.user.storeId;
    return this.priceMarkupService.calculateMarkup(dto);
  }
}
