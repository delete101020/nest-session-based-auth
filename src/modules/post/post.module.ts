import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { POST_MODEL, PostSchema } from './models';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: POST_MODEL, schema: PostSchema }]),
  ],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
