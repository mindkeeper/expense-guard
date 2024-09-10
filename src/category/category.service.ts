import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  CreateCategoryDto,
  TAllCategory,
  TCategory,
  TCategoryQuery,
  UpdateCategoryDto,
} from './dto';
import { PaginatorService } from '../common/paginator.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private paginator: PaginatorService,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<TCategory> {
    return await this.prisma.categories.create({
      data: {
        categoryKey: data.categoryKey,
        categoryName: data.categoryName,
        categoryType: data.categoryType,
      },
      select: {
        id: true,
        categoryKey: true,
        categoryName: true,
        categoryType: true,
      },
    });
  }

  async findAll(query: TCategoryQuery): Promise<TAllCategory> {
    const conditions = [];
    if (query.categoryName) {
      conditions.push({
        categoryName: {
          contains: query.categoryName,
          mode: 'insensitive',
        },
      });
    }
    if (query.categoryKey) {
      conditions.push({
        categoryKey: {
          contains: query.categoryKey,
          mode: 'insensitive',
        },
      });
    }
    if (query.categoryType) {
      conditions.push({
        categoryType: query.categoryType,
      });
    }

    const categories = await this.paginator.paginate(
      this.prisma.categories,
      {
        where: {
          AND: conditions,
        },
        select: {
          id: true,
          categoryKey: true,
          categoryName: true,
          categoryType: true,
        },
        orderBy: {
          [query.sortField]: query.sortDirection,
        },
      },
      { page: query.page, perPage: query.perPage },
    );

    return categories;
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryDto,
  ): Promise<TCategory> {
    return await this.prisma.categories.update({
      where: { id },
      data: {
        categoryKey: data.categoryKey,
        categoryName: data.categoryName,
        categoryType: data.categoryType,
      },
      select: {
        id: true,
        categoryKey: true,
        categoryName: true,
        categoryType: true,
      },
    });
  }
}
