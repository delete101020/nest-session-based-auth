import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QueryParam } from '../../common/decorators';
import { JoiValidationPipe } from '../../common/pipes';
import { paginateResponse } from '../../common/utils';
import { JwtAuthGuard } from '../auth/guards';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos';
import { CreateCategorySchema } from './schemas';

export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
};

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private _categoryService: CategoryService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(CreateCategorySchema)) data: CreateCategoryDto,
  ) {
    return this._categoryService.createFromRequestBody(data);
  }

  @Get()
  async get(@QueryParam() query: CategoryQueryParams) {
    const { page = 1, limit = 10, sort = { name: 1 } } = query;

    const [categories, count] = await Promise.all([
      this._categoryService.get({}, null, {
        limit,
        skip: (page - 1) * limit,
        sort,
      }),
      this._categoryService.count(),
    ]);

    return paginateResponse({ page, limit, count, data: categories });
  }

  @Get(':slug')
  async getOneBySlug(@Param('slug') slug: string) {
    return this._categoryService.getOneBy(slug, 'slug');
  }

  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body(new JoiValidationPipe(CreateCategorySchema)) data: CreateCategoryDto,
  ) {
    return this._categoryService.updateFromRequestBody({
      ...data,
      _id: categoryId,
    });
  }

  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return this._categoryService.delete(categoryId);
  }
}
