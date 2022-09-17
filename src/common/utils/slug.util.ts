import * as randomString from 'randomstring';
import slugify from 'slugify';
import { sanitizeVietnameseInput } from '.';

export const generateSlug = ({
  name,
  len = 5,
  extendRandom = true,
}: {
  name: string;
  len?: number;
  extendRandom?: boolean;
}): string => {
  const sanitizedName = sanitizeVietnameseInput(name);
  const slug = `${slugify(sanitizedName, {
    replacement: '-',
    remove: /[*+~^.,()'"!:@?\/\[\]]/g,
    lower: true,
    trim: true,
  })}`;

  return extendRandom ? `${slug}-${randomString.generate(len)}` : slug;
};

export const compareSlugs = (slug1: string, slug2: string): boolean => {
  return (
    slug1.slice(0, slug1.lastIndexOf('-')) ===
    slug2.slice(0, slug2.lastIndexOf('-'))
  );
};
