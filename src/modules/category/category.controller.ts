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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../common/controllers';
import { QueryParam } from '../../common/decorators';
import { JoiValidationPipe } from '../../common/pipes';
import { paginateResponse } from '../../common/utils';
import { JwtAuthGuard } from '../auth/guards';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { CreateCategorySchema, UpdateCategorySchema } from './schemas';

export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
};

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController extends BaseController {
  constructor(private _categoryService: CategoryService) {
    super();
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(CreateCategorySchema)) data: CreateCategoryDto,
  ) {
    return this._categoryService.createFromRequestBody(data);
  }

  @ApiQuery({
    name: 'query',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 10 },
        sort: { type: 'object', default: 'name:1' },
      },
      required: [],
    },
  })
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
    @Body(new JoiValidationPipe(UpdateCategorySchema)) data: UpdateCategoryDto,
  ) {
    return this._categoryService.updateFromRequestBody({
      ...data,
      _id: categoryId,
    });
  }

  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return this._categoryService.deleteOne(categoryId);
  }
}
