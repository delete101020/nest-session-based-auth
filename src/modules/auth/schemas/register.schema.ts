import * as Joi from 'joi';

export const RegisterSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: [Joi.string().trim(), Joi.any().strip()],
  lastName: [Joi.string().trim(), Joi.any().strip()],
});
