import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../common/schemas';
import { Post, POST_MODEL } from './models';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectModel(POST_MODEL) private readonly _postModel: Model<Post>,
  ) {
    super(_postModel, ['category']);
  }
}
