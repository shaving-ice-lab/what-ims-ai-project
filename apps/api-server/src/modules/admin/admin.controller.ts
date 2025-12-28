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
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  UpdatePermissionsDto,
  UpdateStatusDto,
  AdminQueryDto,
  ResetPasswordDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import {
  RequirePermissions,
  RequireSuperAdmin,
} from '../auth/decorators/permissions.decorator';
import {
  CurrentUser,
  JwtPayload,
} from '../auth/decorators/current-user.decorator';

@ApiTags('管理员管理')
@ApiBearerAuth()
@Controller('admin/admins')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: '创建子管理员' })
  @RequireSuperAdmin()
  async create(@Body() dto: CreateAdminDto, @CurrentUser() user: JwtPayload) {
    return this.adminService.create(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: '获取管理员列表' })
  @RequirePermissions('admin_manage')
  async findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取管理员详情' })
  @RequirePermissions('admin_manage')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新管理员信息' })
  @RequireSuperAdmin()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, dto);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: '更新管理员权限' })
  @RequireSuperAdmin()
  async updatePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const admin = await this.adminService.findOne(user.userId);
    return this.adminService.updatePermissions(id, dto, !!admin.isSuperAdmin);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取管理员权限' })
  @RequirePermissions('admin_manage')
  async getPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getPermissions(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: '启用/禁用管理员' })
  @RequireSuperAdmin()
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.adminService.updateStatus(id, dto.status);
  }

  @Put(':id/reset-password')
  @ApiOperation({ summary: '重置管理员密码' })
  @RequireSuperAdmin()
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    await this.adminService.resetPassword(id, dto);
    return { message: '密码重置成功' };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除管理员' })
  @RequireSuperAdmin()
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.delete(id);
    return { message: '删除成功' };
  }
}
