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
import { BaseQueryParams } from '../../common/interfaces';
import { JoiValidationPipe } from '../../common/pipes';
import { AuthenticatedGuard } from '../auth/guards';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { PostService } from './post.service';
import { CreatePostSchema, UpdatePostSchema } from './schemas';

export type PostQueryParams = BaseQueryParams;

@UseGuards(AuthenticatedGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly _postService: PostService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(CreatePostSchema)) data: CreatePostDto,
  ) {
    return this._postService.createFromRequestBody(data);
  }

  @Get()
  async get(@QueryParam() query: PostQueryParams) {
    const { page = 1, limit = 10, search = '', sort = { name: 1 } } = query;

    const queryObj: Record<string, unknown> = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ],
    };

    const [posts, count] = await Promise.all([
      this._postService.get(queryObj, null, {
        limit,
        skip: (page - 1) * limit,
        sort,
      }),
      this._postService.count(queryObj),
    ]);

    return { page, limit, count, data: posts };
  }

  @Get(':slug')
  async getOneBySlug(@Param('slug') slug: string) {
    return this._postService.getOneBy(slug, 'slug');
  }

  @Put(':postId')
  async update(
    @Param('postId') postId: string,
    @Body(new JoiValidationPipe(UpdatePostSchema)) data: UpdatePostDto,
  ) {
    return this._postService.updateFromRequestBody({ ...data, _id: postId });
  }

  @Delete(':postId')
  async delete(@Param('postId') postId: string) {
    return this._postService.delete(postId);
  }
}
