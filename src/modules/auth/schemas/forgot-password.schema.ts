import * as Joi from 'joi';

export const ForgotPasswordSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
  })
  .options({ stripUnknown: true });
