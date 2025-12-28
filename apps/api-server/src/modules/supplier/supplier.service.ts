import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Supplier,
  DeliveryArea,
  User,
  UserRole,
  SupplierManagementMode,
} from '../../entities';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  UpdateWebhookConfigDto,
  UpdateApiConfigDto,
  SupplierQueryDto,
  DeliveryAreaDto,
} from './dto/supplier.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(DeliveryArea)
    private deliveryAreaRepository: Repository<DeliveryArea>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private generateSupplierNo(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SUP${timestamp}${random}`;
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    let userId = dto.userId;

    if (!userId) {
      const username = `supplier_${this.generateSupplierNo().toLowerCase()}`;
      const defaultPassword = bcrypt.hashSync('123456', 10);

      const user = this.userRepository.create({
        username,
        passwordHash: defaultPassword,
        role: UserRole.SUPPLIER,
        status: 1,
      });
      const savedUser = await this.userRepository.save(user);
      userId = savedUser.id;
    }

    const supplier = this.supplierRepository.create({
      userId,
      supplierNo: this.generateSupplierNo(),
      name: dto.name,
      displayName: dto.displayName || dto.name,
      logo: dto.logo,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      minOrderAmount: dto.minOrderAmount,
      deliveryDays: dto.deliveryDays,
      deliveryMode: dto.deliveryMode,
      managementMode: dto.managementMode,
      hasBackend: dto.hasBackend ? 1 : 0,
      remark: dto.remark,
      status: 1,
    });

    return this.supplierRepository.save(supplier);
  }

  async findAll(query: SupplierQueryDto): Promise<{
    items: Supplier[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, keyword, status, managementMode } = query;

    const qb = this.supplierRepository.createQueryBuilder('supplier');

    if (keyword) {
      qb.andWhere(
        '(supplier.name LIKE :keyword OR supplier.supplierNo LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status !== undefined) {
      qb.andWhere('supplier.status = :status', { status });
    }

    if (managementMode) {
      qb.andWhere('supplier.managementMode = :managementMode', {
        managementMode,
      });
    }

    qb.orderBy('supplier.createdAt', 'DESC');

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['user', 'deliveryAreas'],
    });

    if (!supplier) {
      throw new NotFoundException('供应商不存在');
    }

    return supplier;
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async updateWebhookConfig(
    id: number,
    dto: UpdateWebhookConfigDto,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async updateApiConfig(
    id: number,
    dto: UpdateApiConfigDto,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async regenerateApiSecret(id: number): Promise<{ apiSecretKey: string }> {
    const supplier = await this.findOne(id);
    const newSecret = crypto.randomBytes(32).toString('hex');
    supplier.apiSecretKey = newSecret;
    await this.supplierRepository.save(supplier);
    return { apiSecretKey: newSecret };
  }

  async updateStatus(id: number, status: number): Promise<Supplier> {
    const supplier = await this.findOne(id);
    supplier.status = status;
    return this.supplierRepository.save(supplier);
  }

  async delete(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    supplier.status = 0;
    await this.supplierRepository.save(supplier);
  }

  async getDeliveryAreas(supplierId: number): Promise<DeliveryArea[]> {
    return this.deliveryAreaRepository.find({
      where: { supplierId, status: 1 },
    });
  }

  async setDeliveryAreas(
    supplierId: number,
    areas: DeliveryAreaDto[],
  ): Promise<DeliveryArea[]> {
    await this.findOne(supplierId);

    await this.deliveryAreaRepository.update({ supplierId }, { status: 0 });

    const newAreas = areas.map((area) =>
      this.deliveryAreaRepository.create({
        supplierId,
        ...area,
        status: 1,
      }),
    );

    return this.deliveryAreaRepository.save(newAreas);
  }

  async addDeliveryArea(
    supplierId: number,
    dto: DeliveryAreaDto,
  ): Promise<DeliveryArea> {
    await this.findOne(supplierId);

    const existing = await this.deliveryAreaRepository.findOne({
      where: {
        supplierId,
        province: dto.province,
        city: dto.city,
        district: dto.district || '',
      },
    });

    if (existing) {
      if (existing.status === 0) {
        existing.status = 1;
        return this.deliveryAreaRepository.save(existing);
      }
      throw new BadRequestException('该配送区域已存在');
    }

    const area = this.deliveryAreaRepository.create({
      supplierId,
      ...dto,
      status: 1,
    });

    return this.deliveryAreaRepository.save(area);
  }

  async removeDeliveryArea(supplierId: number, areaId: number): Promise<void> {
    const area = await this.deliveryAreaRepository.findOne({
      where: { id: areaId, supplierId },
    });

    if (!area) {
      throw new NotFoundException('配送区域不存在');
    }

    area.status = 0;
    await this.deliveryAreaRepository.save(area);
  }

  async findByManagementMode(mode: string): Promise<Supplier[]> {
    return this.supplierRepository.find({
      where: { managementMode: mode as SupplierManagementMode, status: 1 },
    });
  }
}
