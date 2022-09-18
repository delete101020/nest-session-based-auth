import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../common/schemas';
import { Category, CATEGORY_MODEL } from './models/category.model';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectModel(CATEGORY_MODEL)
    private readonly _categoryModel: Model<Category>,
  ) {
    super(_categoryModel);
  }
}
