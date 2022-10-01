import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { POST_MODEL, PostSchema } from './models';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: POST_MODEL, schema: PostSchema }]),
    CategoryModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
