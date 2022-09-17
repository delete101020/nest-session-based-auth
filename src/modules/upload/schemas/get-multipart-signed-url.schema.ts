import * as Joi from 'joi';

export const GetMultipartSignedUrlSchema = Joi.object()
  .keys({
    key: Joi.string().trim().required(),
    partNumber: Joi.number().integer(),
    uploadId: Joi.string().trim().required(),
  })
  .options({ stripUnknown: true });
