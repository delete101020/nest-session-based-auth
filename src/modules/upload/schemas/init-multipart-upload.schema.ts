import * as Joi from 'joi';
import { ObjectType, UploadType } from '../models';

export const InitMultipartUploadSchema = Joi.object()
  .keys({
    filename: Joi.string().trim().required(),
    uploadType: Joi.string()
      .trim()
      .valid(...Object.values(UploadType))
      .default(UploadType.IMAGE),
    objectType: [
      Joi.string()
        .trim()
        .valid(...Object.values(ObjectType)),
      Joi.any().strip(),
    ],
    objectId: [
      Joi.string().trim().uuid({ version: 'uuidv4' }),
      Joi.any().strip(),
    ],
  })
  .options({ stripUnknown: true });
