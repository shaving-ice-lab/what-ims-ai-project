import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialSku } from '../../entities/material-sku.entity';
import {
  CreateMaterialSkuDto,
  UpdateMaterialSkuDto,
  MaterialSkuQueryDto,
} from './dto/material-sku.dto';

@Injectable()
export class MaterialSkuService {
  constructor(
    @InjectRepository(MaterialSku)
    private materialSkuRepository: Repository<MaterialSku>,
  ) {}

  private generateSkuCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU${timestamp}${random}`;
  }

  async create(dto: CreateMaterialSkuDto): Promise<MaterialSku> {
    const sku = this.materialSkuRepository.create({
      materialId: dto.materialId,
      skuCode: dto.skuCode || this.generateSkuCode(),
      skuName: dto.skuName,
      skuNo: dto.skuNo,
      brand: dto.brand,
      spec: dto.spec,
      unit: dto.unit,
      weight: dto.weight,
      barcode: dto.barcode,
      imageUrl: dto.imageUrl,
      attributes: dto.attributes,
      costPrice: dto.costPrice || 0,
      salePrice: dto.salePrice || 0,
      marketPrice: dto.marketPrice,
      stock: dto.stock || 0,
      minOrderQty: dto.minOrderQty || 1,
      stepQty: dto.stepQty || 1,
      status: 1,
    });

    return this.materialSkuRepository.save(sku);
  }

  async findAll(query: MaterialSkuQueryDto): Promise<{
    items: MaterialSku[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      materialId,
      brand,
      status,
    } = query;

    const qb = this.materialSkuRepository.createQueryBuilder('sku');
    qb.leftJoinAndSelect('sku.material', 'material');

    if (keyword) {
      qb.andWhere(
        '(sku.skuName LIKE :keyword OR sku.skuCode LIKE :keyword OR sku.barcode LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (materialId) {
      qb.andWhere('sku.materialId = :materialId', { materialId });
    }

    if (brand) {
      qb.andWhere('sku.brand = :brand', { brand });
    }

    if (status !== undefined) {
      qb.andWhere('sku.status = :status', { status });
    }

    qb.orderBy('sku.createdAt', 'DESC');

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

  async findOne(id: number): Promise<MaterialSku> {
    const sku = await this.materialSkuRepository.findOne({
      where: { id },
      relations: ['material'],
    });

    if (!sku) {
      throw new NotFoundException('SKU不存在');
    }

    return sku;
  }

  async findByMaterial(materialId: number): Promise<MaterialSku[]> {
    return this.materialSkuRepository.find({
      where: { materialId, status: 1 },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateMaterialSkuDto): Promise<MaterialSku> {
    const sku = await this.findOne(id);
    Object.assign(sku, dto);
    return this.materialSkuRepository.save(sku);
  }

  async updateStatus(id: number, status: number): Promise<MaterialSku> {
    const sku = await this.findOne(id);
    sku.status = status;
    return this.materialSkuRepository.save(sku);
  }

  async delete(id: number): Promise<void> {
    const sku = await this.findOne(id);
    sku.status = 0;
    await this.materialSkuRepository.save(sku);
  }

  async findByBarcode(barcode: string): Promise<MaterialSku | null> {
    return this.materialSkuRepository.findOne({
      where: { barcode, status: 1 },
      relations: ['material'],
    });
  }

  async getBrands(): Promise<string[]> {
    const result = await this.materialSkuRepository
      .createQueryBuilder('sku')
      .select('DISTINCT sku.brand', 'brand')
      .where('sku.brand IS NOT NULL')
      .andWhere('sku.status = 1')
      .getRawMany();

    return result.map((r) => r.brand).filter(Boolean);
  }
}
