import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
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
} from './dto';
import { JwtGuard } from 'src/token/guard';
import { PermissionStrategy } from 'src/token/strategy';

@Controller('category')
@ApiBearerAuth()
@ApiTags('Category')
@UsePipes(ZodValidationPipe)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    const query = {
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
}
