import * as Joi from 'joi';

export const ResetPasswordSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.string().required(),
  })
  .options({ stripUnknown: true });
