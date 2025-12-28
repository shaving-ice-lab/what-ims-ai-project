import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../../entities/material.entity';
import { Category } from '../../entities/category.entity';
import {
  CreateMaterialDto,
  UpdateMaterialDto,
  MaterialQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/material.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private generateMaterialNo(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MAT${timestamp}${random}`;
  }

  // Category methods
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    let level = 1;
    let path = '';

    if (dto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
      level = parent.level + 1;
      path = parent.path ? `${parent.path}/${parent.id}` : `${parent.id}`;
    }

    const category = this.categoryRepository.create({
      name: dto.name,
      parentId: dto.parentId,
      icon: dto.icon,
      sortOrder: dto.sortOrder || 0,
      level,
      path,
      status: 1,
    });

    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { status: 1 },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findCategoryTree(): Promise<Category[]> {
    const categories = await this.findAllCategories();
    return this.buildCategoryTree(categories);
  }

  private buildCategoryTree(categories: Category[]): Category[] {
    const map = new Map<number, Category & { children?: Category[] }>();
    const roots: (Category & { children?: Category[] })[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (node) {
        if (cat.parentId) {
          const parent = map.get(cat.parentId);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
    });

    return roots;
  }

  async findOneCategory(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOneCategory(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findOneCategory(id);

    const children = await this.categoryRepository.find({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new NotFoundException('该分类下有子分类，无法删除');
    }

    category.status = 0;
    await this.categoryRepository.save(category);
  }

  // Material methods
  async create(dto: CreateMaterialDto): Promise<Material> {
    const material = this.materialRepository.create({
      materialNo: dto.materialNo || this.generateMaterialNo(),
      name: dto.name,
      alias: dto.alias,
      keywords: dto.keywords,
      imageUrl: dto.imageUrl,
      supplierId: dto.supplierId,
      categoryId: dto.categoryId,
      brand: dto.brand,
      unit: dto.unit,
      spec: dto.spec,
      barcode: dto.barcode,
      description: dto.description,
      images: dto.images,
      sortOrder: dto.sortOrder || 0,
      status: 1,
    });

    return this.materialRepository.save(material);
  }

  async findAll(query: MaterialQueryDto): Promise<{
    items: Material[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      supplierId,
      categoryId,
      status,
    } = query;

    const qb = this.materialRepository.createQueryBuilder('material');
    qb.leftJoinAndSelect('material.category', 'category');
    qb.leftJoinAndSelect('material.supplier', 'supplier');

    if (keyword) {
      qb.andWhere(
        '(material.name LIKE :keyword OR material.materialNo LIKE :keyword OR material.alias LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (supplierId) {
      qb.andWhere('material.supplierId = :supplierId', { supplierId });
    }

    if (categoryId) {
      qb.andWhere('material.categoryId = :categoryId', { categoryId });
    }

    if (status !== undefined) {
      qb.andWhere('material.status = :status', { status });
    }

    qb.orderBy('material.sortOrder', 'ASC');
    qb.addOrderBy('material.createdAt', 'DESC');

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

  async findOne(id: number): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['category', 'supplier'],
    });

    if (!material) {
      throw new NotFoundException('物料不存在');
    }

    return material;
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);
    Object.assign(material, dto);
    return this.materialRepository.save(material);
  }

  async updateStatus(id: number, status: number): Promise<Material> {
    const material = await this.findOne(id);
    material.status = status;
    return this.materialRepository.save(material);
  }

  async delete(id: number): Promise<void> {
    const material = await this.findOne(id);
    material.status = 0;
    await this.materialRepository.save(material);
  }

  async findBySupplier(supplierId: number): Promise<Material[]> {
    return this.materialRepository.find({
      where: { supplierId, status: 1 },
      relations: ['category'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Material[]> {
    return this.materialRepository.find({
      where: { categoryId, status: 1 },
      relations: ['supplier'],
      order: { sortOrder: 'ASC' },
    });
  }
}
