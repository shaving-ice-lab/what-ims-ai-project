import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  SupplierMaterial,
  StockStatus,
  AuditStatus,
} from '../../entities/supplier-material.entity';
import {
  CreateSupplierMaterialDto,
  UpdateSupplierMaterialDto,
  SupplierMaterialQueryDto,
  BatchUpdatePriceDto,
} from './dto/supplier-material.dto';

@Injectable()
export class SupplierMaterialService {
  constructor(
    @InjectRepository(SupplierMaterial)
    private supplierMaterialRepository: Repository<SupplierMaterial>,
  ) {}

  async create(dto: CreateSupplierMaterialDto): Promise<SupplierMaterial> {
    const existing = await this.supplierMaterialRepository.findOne({
      where: { supplierId: dto.supplierId, materialSkuId: dto.materialSkuId },
    });

    if (existing) {
      throw new NotFoundException('该供应商已存在此物料报价');
    }

    const supplierMaterial = this.supplierMaterialRepository.create({
      supplierId: dto.supplierId,
      materialSkuId: dto.materialSkuId,
      price: dto.price,
      originalPrice: dto.originalPrice,
      minQuantity: dto.minQuantity || 1,
      stepQuantity: dto.stepQuantity || 1,
      stockStatus: dto.stockStatus || StockStatus.IN_STOCK,
      auditStatus: AuditStatus.PENDING,
      status: 1,
    });

    return this.supplierMaterialRepository.save(supplierMaterial);
  }

  async findAll(query: SupplierMaterialQueryDto): Promise<{
    items: SupplierMaterial[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      supplierId,
      materialSkuId,
      keyword,
      stockStatus,
      auditStatus,
      status,
    } = query;

    const qb = this.supplierMaterialRepository.createQueryBuilder('sm');
    qb.leftJoinAndSelect('sm.supplier', 'supplier');
    qb.leftJoinAndSelect('sm.materialSku', 'materialSku');
    qb.leftJoinAndSelect('materialSku.material', 'material');

    if (supplierId) {
      qb.andWhere('sm.supplierId = :supplierId', { supplierId });
    }

    if (materialSkuId) {
      qb.andWhere('sm.materialSkuId = :materialSkuId', { materialSkuId });
    }

    if (keyword) {
      qb.andWhere(
        '(materialSku.skuName LIKE :keyword OR materialSku.skuCode LIKE :keyword OR material.name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (stockStatus) {
      qb.andWhere('sm.stockStatus = :stockStatus', { stockStatus });
    }

    if (auditStatus) {
      qb.andWhere('sm.auditStatus = :auditStatus', { auditStatus });
    }

    if (status !== undefined) {
      qb.andWhere('sm.status = :status', { status });
    }

    qb.orderBy('sm.createdAt', 'DESC');

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

  async findOne(id: number): Promise<SupplierMaterial> {
    const supplierMaterial = await this.supplierMaterialRepository.findOne({
      where: { id },
      relations: ['supplier', 'materialSku', 'materialSku.material'],
    });

    if (!supplierMaterial) {
      throw new NotFoundException('供应商物料报价不存在');
    }

    return supplierMaterial;
  }

  async findBySupplier(supplierId: number): Promise<SupplierMaterial[]> {
    return this.supplierMaterialRepository.find({
      where: { supplierId, status: 1, auditStatus: AuditStatus.APPROVED },
      relations: ['materialSku', 'materialSku.material'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByMaterialSku(materialSkuId: number): Promise<SupplierMaterial[]> {
    return this.supplierMaterialRepository.find({
      where: {
        materialSkuId,
        status: 1,
        auditStatus: AuditStatus.APPROVED,
        stockStatus: StockStatus.IN_STOCK,
      },
      relations: ['supplier'],
      order: { price: 'ASC' },
    });
  }

  async update(
    id: number,
    dto: UpdateSupplierMaterialDto,
  ): Promise<SupplierMaterial> {
    const supplierMaterial = await this.findOne(id);
    Object.assign(supplierMaterial, dto);
    return this.supplierMaterialRepository.save(supplierMaterial);
  }

  async updateStockStatus(
    id: number,
    stockStatus: StockStatus,
  ): Promise<SupplierMaterial> {
    const supplierMaterial = await this.findOne(id);
    supplierMaterial.stockStatus = stockStatus;
    return this.supplierMaterialRepository.save(supplierMaterial);
  }

  async audit(
    id: number,
    auditStatus: AuditStatus,
    rejectReason?: string,
  ): Promise<SupplierMaterial> {
    const supplierMaterial = await this.findOne(id);
    supplierMaterial.auditStatus = auditStatus;
    if (auditStatus === AuditStatus.REJECTED && rejectReason) {
      supplierMaterial.rejectReason = rejectReason;
    }
    return this.supplierMaterialRepository.save(supplierMaterial);
  }

  async delete(id: number): Promise<void> {
    const supplierMaterial = await this.findOne(id);
    supplierMaterial.status = 0;
    await this.supplierMaterialRepository.save(supplierMaterial);
  }

  async batchUpdatePrice(
    supplierId: number,
    dto: BatchUpdatePriceDto,
  ): Promise<number> {
    const materials = await this.supplierMaterialRepository.find({
      where: {
        supplierId,
        materialSkuId: In(dto.materialSkuIds),
        status: 1,
      },
    });

    for (const material of materials) {
      if (dto.adjustType === 'fixed') {
        material.price = Number(material.price) + dto.adjustValue;
      } else {
        material.price = Number(material.price) * (1 + dto.adjustValue / 100);
      }
      material.price = Math.max(0, Number(material.price.toFixed(2)));
    }

    await this.supplierMaterialRepository.save(materials);
    return materials.length;
  }

  async getLowestPrice(materialSkuId: number): Promise<number | null> {
    const result = await this.supplierMaterialRepository
      .createQueryBuilder('sm')
      .select('MIN(sm.price)', 'minPrice')
      .where('sm.materialSkuId = :materialSkuId', { materialSkuId })
      .andWhere('sm.status = 1')
      .andWhere('sm.auditStatus = :auditStatus', {
        auditStatus: AuditStatus.APPROVED,
      })
      .andWhere('sm.stockStatus = :stockStatus', {
        stockStatus: StockStatus.IN_STOCK,
      })
      .getRawOne();

    return result?.minPrice ? Number(result.minPrice) : null;
  }

  async getPriceComparison(
    supplierId: number,
  ): Promise<{ lowest: number; higher: number; equal: number }> {
    const materials = await this.supplierMaterialRepository.find({
      where: { supplierId, status: 1, auditStatus: AuditStatus.APPROVED },
    });

    let lowest = 0;
    let higher = 0;
    let equal = 0;

    for (const material of materials) {
      const lowestPrice = await this.getLowestPrice(material.materialSkuId);
      if (lowestPrice === null) continue;

      if (Number(material.price) < lowestPrice) {
        lowest++;
      } else if (Number(material.price) > lowestPrice) {
        higher++;
      } else {
        equal++;
      }
    }

    return { lowest, higher, equal };
  }
}
