import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectType, UploadType } from '../models';

export class InitMultipartUploadDto {
  @ApiProperty({ example: 'large-file.pdf' })
  filename: string;

  @ApiProperty({ example: 'document', enum: UploadType })
  uploadType: UploadType;

  @ApiPropertyOptional({ example: 'blog', enum: ObjectType })
  objectType?: ObjectType;

  @ApiPropertyOptional({ type: 'string', format: 'uuid' })
  objectId?: string;
}
