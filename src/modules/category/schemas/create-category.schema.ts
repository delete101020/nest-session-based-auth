import * as Joi from 'joi';

export const CreateCategorySchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  description: [Joi.string().trim(), Joi.any().strip()],
  image: [Joi.string().trim(), Joi.any().strip()],
});
