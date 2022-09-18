import * as Joi from 'joi';

export const UpdateCategorySchema = Joi.object().keys({
  name: [Joi.string().trim(), Joi.any().strip()],
  description: [Joi.string().trim(), Joi.any().strip()],
  image: [Joi.string().trim(), Joi.any().strip()],
});
