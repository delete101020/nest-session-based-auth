import * as Joi from 'joi';

export const UpdatePostSchema = Joi.object().keys({
  title: [Joi.string().trim(), Joi.any().strip()],
  content: [Joi.string().trim(), Joi.any().strip()],
  image: [Joi.string().trim(), Joi.any().strip()],
  category: [Joi.string().trim(), Joi.any().strip()],
});
