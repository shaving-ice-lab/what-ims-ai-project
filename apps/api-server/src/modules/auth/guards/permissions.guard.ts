import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PERMISSIONS_KEY,
  SUPER_ADMIN_KEY,
} from '../decorators/permissions.decorator';
import { Admin } from '../../../entities';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否需要超级管理员权限
    const requireSuperAdmin = this.reflector.getAllAndOverride<boolean>(
      SUPER_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 获取所需权限
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有权限要求，直接通过
    if (!requiredPermissions && !requireSuperAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('请先登录');
    }

    // 如果不是管理员角色，检查是否有特定角色权限
    if (user.currentRole !== 'admin') {
      // 供应商和门店角色只能访问其对应的接口
      // 这里可以根据业务需求进行扩展
      return this.checkRoleBasedAccess(user, requiredPermissions);
    }

    // 管理员角色，需要查询权限
    const admin = await this.adminRepository.findOne({
      where: { userId: user.userId, status: 1 },
    });

    if (!admin) {
      throw new ForbiddenException('管理员账号不存在或已禁用');
    }

    // 超级管理员检查
    if (requireSuperAdmin) {
      if (!admin.isSuperAdmin) {
        throw new ForbiddenException('此操作仅限超级管理员');
      }
      return true;
    }

    // 超级管理员拥有所有权限
    if (admin.isSuperAdmin) {
      return true;
    }

    // 检查普通管理员权限
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const adminPermissions = admin.permissions || [];
    const hasPermission = requiredPermissions.some((permission) =>
      adminPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('您没有执行此操作的权限');
    }

    return true;
  }

  private checkRoleBasedAccess(
    user: JwtPayload,
    requiredPermissions?: string[],
  ): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 供应商角色可访问的权限模块
    const supplierAllowedModules = ['supplier', 'material', 'order'];
    // 门店角色可访问的权限模块
    const storeAllowedModules = ['store', 'order'];

    let allowedModules: string[] = [];
    if (user.currentRole === 'supplier') {
      allowedModules = supplierAllowedModules;
    } else if (user.currentRole === 'store') {
      allowedModules = storeAllowedModules;
    }

    const hasAccess = requiredPermissions.some((permission) =>
      allowedModules.includes(permission),
    );

    if (!hasAccess) {
      throw new ForbiddenException('当前角色无权访问此资源');
    }

    return true;
  }
}
