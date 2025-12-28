import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { PriceMarkup, MarkupType } from '../../entities/price-markup.entity';
import {
  CreatePriceMarkupDto,
  UpdatePriceMarkupDto,
  PriceMarkupQueryDto,
  CalculateMarkupDto,
} from './dto/price-markup.dto';

@Injectable()
export class PriceMarkupService {
  constructor(
    @InjectRepository(PriceMarkup)
    private priceMarkupRepository: Repository<PriceMarkup>,
  ) {}

  async create(
    dto: CreatePriceMarkupDto,
    createdBy: number,
  ): Promise<PriceMarkup> {
    const markup = this.priceMarkupRepository.create({
      name: dto.name,
      description: dto.description,
      storeId: dto.storeId,
      supplierId: dto.supplierId,
      categoryId: dto.categoryId,
      materialId: dto.materialId,
      markupType: dto.markupType,
      markupValue: dto.markupValue,
      minMarkup: dto.minMarkup,
      maxMarkup: dto.maxMarkup,
      priority: dto.priority || 0,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      createdBy,
      isActive: 1,
    });

    return this.priceMarkupRepository.save(markup);
  }

  async findAll(query: PriceMarkupQueryDto): Promise<{
    items: PriceMarkup[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      storeId,
      supplierId,
      categoryId,
      markupType,
      isActive,
    } = query;

    const qb = this.priceMarkupRepository.createQueryBuilder('markup');
    qb.leftJoinAndSelect('markup.store', 'store');
    qb.leftJoinAndSelect('markup.supplier', 'supplier');
    qb.leftJoinAndSelect('markup.category', 'category');
    qb.leftJoinAndSelect('markup.material', 'material');

    if (keyword) {
      qb.andWhere(
        '(markup.name LIKE :keyword OR markup.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (storeId !== undefined) {
      if (storeId === 0) {
        qb.andWhere('markup.storeId IS NULL');
      } else {
        qb.andWhere('markup.storeId = :storeId', { storeId });
      }
    }

    if (supplierId !== undefined) {
      if (supplierId === 0) {
        qb.andWhere('markup.supplierId IS NULL');
      } else {
        qb.andWhere('markup.supplierId = :supplierId', { supplierId });
      }
    }

    if (categoryId !== undefined) {
      if (categoryId === 0) {
        qb.andWhere('markup.categoryId IS NULL');
      } else {
        qb.andWhere('markup.categoryId = :categoryId', { categoryId });
      }
    }

    if (markupType) {
      qb.andWhere('markup.markupType = :markupType', { markupType });
    }

    if (isActive !== undefined) {
      qb.andWhere('markup.isActive = :isActive', { isActive });
    }

    qb.orderBy('markup.priority', 'DESC');
    qb.addOrderBy('markup.createdAt', 'DESC');

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

  async findOne(id: number): Promise<PriceMarkup> {
    const markup = await this.priceMarkupRepository.findOne({
      where: { id },
      relations: ['store', 'supplier', 'category', 'material'],
    });

    if (!markup) {
      throw new NotFoundException('加价规则不存在');
    }

    return markup;
  }

  async update(id: number, dto: UpdatePriceMarkupDto): Promise<PriceMarkup> {
    const markup = await this.findOne(id);

    if (dto.startTime) {
      markup.startTime = new Date(dto.startTime);
      delete (dto as Record<string, unknown>).startTime;
    }
    if (dto.endTime) {
      markup.endTime = new Date(dto.endTime);
      delete (dto as Record<string, unknown>).endTime;
    }

    Object.assign(markup, dto);
    return this.priceMarkupRepository.save(markup);
  }

  async updateStatus(id: number, isActive: number): Promise<PriceMarkup> {
    const markup = await this.findOne(id);
    markup.isActive = isActive;
    return this.priceMarkupRepository.save(markup);
  }

  async delete(id: number): Promise<void> {
    const markup = await this.findOne(id);
    await this.priceMarkupRepository.remove(markup);
  }

  async findMatchingRule(params: {
    storeId?: number;
    supplierId?: number;
    categoryId?: number;
    materialId?: number;
  }): Promise<PriceMarkup | null> {
    const now = new Date();

    const qb = this.priceMarkupRepository.createQueryBuilder('markup');
    qb.where('markup.isActive = 1');

    qb.andWhere('(markup.startTime IS NULL OR markup.startTime <= :now)', {
      now,
    });
    qb.andWhere('(markup.endTime IS NULL OR markup.endTime >= :now)', { now });

    if (params.storeId) {
      qb.andWhere('(markup.storeId IS NULL OR markup.storeId = :storeId)', {
        storeId: params.storeId,
      });
    } else {
      qb.andWhere('markup.storeId IS NULL');
    }

    if (params.supplierId) {
      qb.andWhere(
        '(markup.supplierId IS NULL OR markup.supplierId = :supplierId)',
        { supplierId: params.supplierId },
      );
    } else {
      qb.andWhere('markup.supplierId IS NULL');
    }

    if (params.categoryId) {
      qb.andWhere(
        '(markup.categoryId IS NULL OR markup.categoryId = :categoryId)',
        { categoryId: params.categoryId },
      );
    } else {
      qb.andWhere('markup.categoryId IS NULL');
    }

    if (params.materialId) {
      qb.andWhere(
        '(markup.materialId IS NULL OR markup.materialId = :materialId)',
        { materialId: params.materialId },
      );
    } else {
      qb.andWhere('markup.materialId IS NULL');
    }

    qb.orderBy('markup.priority', 'DESC');
    qb.limit(1);

    return qb.getOne();
  }

  async calculateMarkup(dto: CalculateMarkupDto): Promise<{
    originalPrice: number;
    markupAmount: number;
    finalPrice: number;
    rule: PriceMarkup | null;
  }> {
    const rule = await this.findMatchingRule({
      storeId: dto.storeId,
      supplierId: dto.supplierId,
      categoryId: dto.categoryId,
      materialId: dto.materialId,
    });

    if (!rule) {
      return {
        originalPrice: dto.originalPrice,
        markupAmount: 0,
        finalPrice: dto.originalPrice,
        rule: null,
      };
    }

    let markupAmount: number;

    if (rule.markupType === MarkupType.FIXED) {
      markupAmount = Number(rule.markupValue);
    } else {
      markupAmount = dto.originalPrice * Number(rule.markupValue);

      if (rule.minMarkup && markupAmount < Number(rule.minMarkup)) {
        markupAmount = Number(rule.minMarkup);
      }
      if (rule.maxMarkup && markupAmount > Number(rule.maxMarkup)) {
        markupAmount = Number(rule.maxMarkup);
      }
    }

    markupAmount = Math.round(markupAmount * 100) / 100;

    return {
      originalPrice: dto.originalPrice,
      markupAmount,
      finalPrice: dto.originalPrice + markupAmount,
      rule,
    };
  }

  async getActiveRules(): Promise<PriceMarkup[]> {
    const now = new Date();

    return this.priceMarkupRepository.find({
      where: [
        {
          isActive: 1,
          startTime: IsNull(),
          endTime: IsNull(),
        },
        {
          isActive: 1,
          startTime: LessThanOrEqual(now),
          endTime: IsNull(),
        },
        {
          isActive: 1,
          startTime: IsNull(),
          endTime: MoreThanOrEqual(now),
        },
        {
          isActive: 1,
          startTime: LessThanOrEqual(now),
          endTime: MoreThanOrEqual(now),
        },
      ],
      relations: ['store', 'supplier', 'category', 'material'],
      order: { priority: 'DESC' },
    });
  }
}
