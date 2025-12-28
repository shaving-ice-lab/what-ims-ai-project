import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Admin, UserRole } from '../../entities';
import {
  CreateAdminDto,
  UpdateAdminDto,
  UpdatePermissionsDto,
  AdminQueryDto,
  ResetPasswordDto,
} from './dto/admin.dto';
import { SENSITIVE_PERMISSIONS } from '@project/constants';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(dto: CreateAdminDto, creatorId: number): Promise<Admin> {
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    const filteredPermissions = this.filterSensitivePermissions(
      dto.permissions || [],
    );

    const user = this.userRepository.create({
      username: dto.username,
      passwordHash: bcrypt.hashSync(dto.password, 10),
      role: UserRole.ADMIN,
      status: 1,
    });

    const savedUser = await this.userRepository.save(user);

    const admin = this.adminRepository.create({
      userId: savedUser.id,
      name: dto.name,
      isPrimary: 0,
      isSuperAdmin: 0,
      permissions: filteredPermissions,
      createdBy: creatorId,
      remark: dto.remark,
      status: 1,
    });

    return this.adminRepository.save(admin);
  }

  async findAll(query: AdminQueryDto): Promise<{
    list: Admin[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .where('admin.isPrimary = :isPrimary', { isPrimary: 0 });

    if (query.keyword) {
      queryBuilder.andWhere(
        '(user.username LIKE :keyword OR admin.name LIKE :keyword)',
        { keyword: `%${query.keyword}%` },
      );
    }

    if (query.status !== undefined) {
      queryBuilder.andWhere('admin.status = :status', { status: query.status });
    }

    const [list, total] = await queryBuilder
      .orderBy('admin.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['user', 'creator'],
    });

    if (!admin) {
      throw new NotFoundException('管理员不存在');
    }

    return admin;
  }

  async update(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    if (admin.isPrimary) {
      throw new ForbiddenException('不能修改主管理员信息');
    }

    Object.assign(admin, dto);
    return this.adminRepository.save(admin);
  }

  async updatePermissions(
    id: number,
    dto: UpdatePermissionsDto,
    isSuperAdmin: boolean,
  ): Promise<Admin> {
    const admin = await this.findOne(id);

    if (admin.isPrimary || admin.isSuperAdmin) {
      throw new ForbiddenException('不能修改主管理员/超级管理员权限');
    }

    let permissions = dto.permissions;
    if (!isSuperAdmin) {
      permissions = this.filterSensitivePermissions(permissions);
    }

    admin.permissions = permissions;
    return this.adminRepository.save(admin);
  }

  async getPermissions(id: number): Promise<string[]> {
    const admin = await this.findOne(id);
    return admin.permissions || [];
  }

  async updateStatus(id: number, status: number): Promise<Admin> {
    const admin = await this.findOne(id);

    if (admin.isPrimary || admin.isSuperAdmin) {
      throw new ForbiddenException('不能禁用主管理员/超级管理员');
    }

    admin.status = status;

    if (admin.user) {
      admin.user.status = status;
      await this.userRepository.save(admin.user);
    }

    return this.adminRepository.save(admin);
  }

  async resetPassword(id: number, dto: ResetPasswordDto): Promise<void> {
    const admin = await this.findOne(id);

    if (!admin.user) {
      throw new NotFoundException('关联用户不存在');
    }

    admin.user.passwordHash = bcrypt.hashSync(dto.newPassword, 10);
    await this.userRepository.save(admin.user);
  }

  async delete(id: number): Promise<void> {
    const admin = await this.findOne(id);

    if (admin.isPrimary || admin.isSuperAdmin) {
      throw new ForbiddenException('不能删除主管理员/超级管理员');
    }

    await this.adminRepository.softDelete(id);

    if (admin.user) {
      await this.userRepository.softDelete(admin.user.id);
    }
  }

  private filterSensitivePermissions(permissions: string[]): string[] {
    return permissions.filter(
      (p) => !SENSITIVE_PERMISSIONS.includes(p as never),
    );
  }
}
