import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store, User, UserRole } from '../../entities';
import { CreateStoreDto, UpdateStoreDto, StoreQueryDto } from './dto/store.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private generateStoreNo(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `STR${timestamp}${random}`;
  }

  async create(dto: CreateStoreDto): Promise<Store> {
    let userId = dto.userId;

    if (!userId) {
      const username = `store_${this.generateStoreNo().toLowerCase()}`;
      const defaultPassword = bcrypt.hashSync('123456', 10);

      const user = this.userRepository.create({
        username,
        passwordHash: defaultPassword,
        role: UserRole.STORE,
        status: 1,
      });
      const savedUser = await this.userRepository.save(user);
      userId = savedUser.id;
    }

    const store = this.storeRepository.create({
      userId,
      storeNo: dto.storeNo || this.generateStoreNo(),
      name: dto.name,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      province: dto.province,
      city: dto.city,
      district: dto.district,
      address: dto.address,
      longitude: dto.longitude,
      latitude: dto.latitude,
      remark: dto.remark,
      status: 1,
    });

    return this.storeRepository.save(store);
  }

  async findAll(query: StoreQueryDto): Promise<{
    items: Store[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, keyword, status, province, city } = query;

    const qb = this.storeRepository.createQueryBuilder('store');

    if (keyword) {
      qb.andWhere('(store.name LIKE :keyword OR store.storeNo LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (status !== undefined) {
      qb.andWhere('store.status = :status', { status });
    }

    if (province) {
      qb.andWhere('store.province = :province', { province });
    }

    if (city) {
      qb.andWhere('store.city = :city', { city });
    }

    qb.orderBy('store.createdAt', 'DESC');

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

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  async update(id: number, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, dto);
    return this.storeRepository.save(store);
  }

  async updateMarkup(id: number, markupEnabled: number): Promise<Store> {
    const store = await this.findOne(id);
    store.markupEnabled = markupEnabled;
    return this.storeRepository.save(store);
  }

  async updateStatus(id: number, status: number): Promise<Store> {
    const store = await this.findOne(id);
    store.status = status;
    return this.storeRepository.save(store);
  }

  async delete(id: number): Promise<void> {
    const store = await this.findOne(id);
    store.status = 0;
    await this.storeRepository.save(store);
  }

  async findByArea(province: string, city?: string): Promise<Store[]> {
    const qb = this.storeRepository.createQueryBuilder('store');
    qb.where('store.province = :province', { province });
    qb.andWhere('store.status = 1');

    if (city) {
      qb.andWhere('store.city = :city', { city });
    }

    return qb.getMany();
  }
}
