import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../common/schemas';
import { generateSlug } from '../../../common/utils';
import { CATEGORY_MODEL } from '../../category/models/category.model';

export const POST_MODEL = 'Post';

@Schema()
export class Post extends BaseModel {
  _id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  image: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: CATEGORY_MODEL })
  category: string;

  @Prop({ unique: true })
  slug: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// TODO: check if slug is unique
PostSchema.pre<Post>('save', async function (next: any) {
  this.slug = generateSlug({ name: this.title });
  next();
});

PostSchema.pre('findOneAndUpdate', async function (next: any) {
  const update = { ...this.getUpdate() } as Post;
  if (update.title) {
    update.slug = generateSlug({ name: update.title });
    this.setUpdate(update);
  }

  next();
});
