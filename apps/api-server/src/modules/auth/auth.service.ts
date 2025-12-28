import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, Admin, Store, Supplier } from '../../entities';
import { LoginDto, SelectRoleDto, LoginResponseDto } from './dto/login.dto';
import { JwtPayload } from './decorators/current-user.decorator';
import {
  hashPasswordCompact,
  verifyPasswordCompact,
  generateSecureRandom,
} from '@project/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password, rememberMe } = loginDto;

    // 检查登录失败次数
    const failKey = `login_fail:${username}`;
    const failCount = (await this.cacheManager.get<number>(failKey)) || 0;
    if (failCount >= 5) {
      throw new BadRequestException('账号已被锁定，请15分钟后再试');
    }

    // 查找用户
    const user = await this.userRepository.findOne({
      where: { username, status: 1 },
    });

    if (!user) {
      await this.incrementFailCount(failKey);
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = verifyPasswordCompact(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.incrementFailCount(failKey);
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 清除失败计数
    await this.cacheManager.del(failKey);

    // 获取用户角色
    const roles = await this.getUserRoles(user.id);

    if (roles.length === 0) {
      throw new UnauthorizedException('该账号没有分配任何角色');
    }

    // 生成session ID
    const sessionId = generateSecureRandom(32);

    // 如果只有一个角色，直接生成包含角色信息的Token
    if (roles.length === 1) {
      const currentRole = roles[0];
      const tokens = await this.generateTokens(
        {
          userId: user.id,
          username: user.username,
          currentRole: currentRole.role,
          roleId: currentRole.roleId,
          sessionId,
        },
        rememberMe,
      );

      return {
        ...tokens,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname || user.username,
          avatar: user.avatar,
          roles,
        },
        currentRole,
        needSelectRole: false,
      };
    }

    // 多角色用户，返回角色列表让用户选择
    const tokens = await this.generateTokens(
      {
        userId: user.id,
        username: user.username,
        sessionId,
      },
      rememberMe,
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname || user.username,
        avatar: user.avatar,
        roles,
      },
      needSelectRole: true,
    };
  }

  async selectRole(
    userId: number,
    selectRoleDto: SelectRoleDto,
  ): Promise<LoginResponseDto> {
    const { role, roleId } = selectRoleDto;

    // 验证用户是否拥有该角色
    const user = await this.userRepository.findOne({
      where: { id: userId, status: 1 },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const roles = await this.getUserRoles(userId);
    const targetRole = roles.find(
      (r) => r.role === role && (!roleId || r.roleId === roleId),
    );

    if (!targetRole) {
      throw new BadRequestException('您没有该角色权限');
    }

    const sessionId = generateSecureRandom(32);
    const tokens = await this.generateTokens({
      userId: user.id,
      username: user.username,
      currentRole: role,
      roleId: targetRole.roleId,
      sessionId,
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname || user.username,
        avatar: user.avatar,
        roles,
      },
      currentRole: targetRole,
      needSelectRole: false,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          process.env.JWT_SECRET ||
          'default-secret',
      });

      // 检查Token是否在黑名单中
      const blacklistKey = `token_blacklist:${payload.sessionId}`;
      const isBlacklisted = await this.cacheManager.get(blacklistKey);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token已失效');
      }

      // 生成新的accessToken
      const newPayload: JwtPayload = {
        userId: payload.userId,
        username: payload.username,
        currentRole: payload.currentRole,
        roleId: payload.roleId,
        sessionId: payload.sessionId,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '2h',
      });

      return {
        accessToken,
        expiresIn: 7200,
      };
    } catch {
      throw new UnauthorizedException('刷新Token无效或已过期');
    }
  }

  async logout(sessionId: string): Promise<void> {
    // 将sessionId加入黑名单
    const blacklistKey = `token_blacklist:${sessionId}`;
    await this.cacheManager.set(blacklistKey, true, 7 * 24 * 60 * 60 * 1000); // 7天
  }

  private async getUserRoles(userId: number): Promise<
    Array<{
      role: 'admin' | 'supplier' | 'store';
      roleId?: number;
      roleName?: string;
    }>
  > {
    const roles: Array<{
      role: 'admin' | 'supplier' | 'store';
      roleId?: number;
      roleName?: string;
    }> = [];

    // 检查是否是管理员
    const admin = await this.adminRepository.findOne({
      where: { userId, status: 1 },
    });
    if (admin) {
      roles.push({
        role: 'admin',
        roleId: admin.id,
        roleName: admin.isSuperAdmin ? '超级管理员' : '管理员',
      });
    }

    // 检查是否是供应商
    const supplier = await this.supplierRepository.findOne({
      where: { userId, status: 1 },
    });
    if (supplier) {
      roles.push({
        role: 'supplier',
        roleId: supplier.id,
        roleName: supplier.name,
      });
    }

    // 检查是否是门店
    const store = await this.storeRepository.findOne({
      where: { userId, status: 1 },
    });
    if (store) {
      roles.push({
        role: 'store',
        roleId: store.id,
        roleName: store.name,
      });
    }

    return roles;
  }

  private async generateTokens(
    payload: JwtPayload,
    rememberMe?: boolean,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        process.env.JWT_SECRET ||
        'default-secret',
      expiresIn: rememberMe ? '30d' : '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 7200,
    };
  }

  private async incrementFailCount(key: string): Promise<void> {
    const count = (await this.cacheManager.get<number>(key)) || 0;
    await this.cacheManager.set(key, count + 1, 15 * 60 * 1000); // 15分钟
  }

  // 密码哈希工具方法（用于创建用户时）
  hashPassword(password: string): string {
    return hashPasswordCompact(password);
  }
}
