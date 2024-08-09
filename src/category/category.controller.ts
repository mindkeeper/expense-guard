import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  CreateCategoryDto,
  CreateCategoryResponse,
  TAllCategory,
  TCategory,
  TCategoryQuery,
} from './dto';
import { JwtGuard } from 'src/token/guard';
import { PermissionStrategy } from 'src/token/strategy';

@Controller('category')
@ApiBearerAuth()
@ApiTags('Category')
@UsePipes(ZodValidationPipe)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // create category
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: CreateCategoryResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['create-category']))
  async createCategory(@Body() data: CreateCategoryDto): Promise<TCategory> {
    return await this.categoryService.createCategory(data);
  }

  // find all categories
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['get-categories']))
  @ApiQuery({ name: 'categoryName', required: false })
  @ApiQuery({ name: 'categoryKey', required: false })
  @ApiQuery({
    name: 'categoryType',
    required: false,
    enum: ['INCOME', 'EXPENSE'],
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] })
  async findAll(
    @Query('categoryName') categoryName?: string,
    @Query('categoryKey') categoryKey?: string,
    @Query('categoryType') categoryType?: 'INCOME' | 'EXPENSE',
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('perPage', new ParseIntPipe({ optional: true })) perPage?: number,
    @Query('sortField', new DefaultValuePipe('id')) sortField?: string,
    @Query('sortDirection', new DefaultValuePipe('asc'))
    sordDirection?: 'asc' | 'desc',
  ): Promise<TAllCategory> {
    const query: TCategoryQuery = {
      categoryName,
      categoryKey,
      categoryType,
      page,
      perPage,
      sortField,
      sortDirection: sordDirection,
    };
    return await this.categoryService.findAll(query);
  }

  // Update Category

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateCategoryResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(JwtGuard, new PermissionStrategy(['update-category']))
  async updateCategory(
    @Body() data: CreateCategoryDto,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<TCategory> {
    return await this.categoryService.updateCategory(id, data);
  }
}
