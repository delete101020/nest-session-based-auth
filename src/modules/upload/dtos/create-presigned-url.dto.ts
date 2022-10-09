import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectType, UploadType } from '../models';

export class CreatePresignedURLDto {
  @ApiProperty({ example: 'background.png' })
  filename: string;

  @ApiProperty({ example: 'image', enum: UploadType })
  uploadType: UploadType;

  @ApiPropertyOptional({ example: 'profile', enum: ObjectType })
  objectType?: ObjectType;

  @ApiPropertyOptional({ type: 'string', format: 'uuid' })
  objectId?: string;
}
