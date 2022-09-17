import { ObjectType, UploadType } from '../models';

export class InitMultipartUploadDto {
  filename: string;
  uploadType: UploadType;
  objectType?: ObjectType;
  objectId?: string;
}
