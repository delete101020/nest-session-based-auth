import * as Joi from 'joi';

export const CompleteMultipartUploadSchema = Joi.object()
  .keys({
    key: Joi.string().trim().required(),
    parts: Joi.array()
      .min(1)
      .items(
        Joi.object().keys({
          ETag: Joi.string().trim(),
          PartNumber: Joi.number().integer(),
        }),
      ),
    uploadId: Joi.string().trim().required(),
  })
  .options({ stripUnknown: true });
