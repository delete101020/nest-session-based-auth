import { ObjectType, UploadType } from '../models';

export class CreatePresignedURLDto {
  filename: string;
  uploadType: UploadType;
  objectType?: ObjectType;
  objectId?: string;
}
