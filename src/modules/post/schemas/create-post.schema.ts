import * as Joi from 'joi';

export const CreatePostSchema = Joi.object().keys({
  title: Joi.string().trim().required(),
  content: [Joi.string().trim(), Joi.any().strip()],
  image: [Joi.string().trim(), Joi.any().strip()],
  category: [Joi.string().trim(), Joi.any().strip()],
});
