import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '../../../common/schemas';
import { generateSlug } from '../../../common/utils';

export const CATEGORY_MODEL = 'Category';

@Schema()
export class Category extends BaseModel {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ unique: true })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre<Category>('save', async function (next) {
  this.slug = generateSlug({ name: this.name });
  next();
});

CategorySchema.pre('findOneAndUpdate', async function (next) {
  const update = { ...this.getUpdate() } as Category;
  if (update.name) {
    update.slug = generateSlug({ name: update.name });
    this.setUpdate(update);
  }

  next();
});
