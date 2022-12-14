import * as Joi from 'joi';

export const LoginSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  .options({ stripUnknown: true });
