import { ApiProperty } from '@nestjs/swagger';

export class GetMultipartSignedUrlDto {
  @ApiProperty({ example: 'background.png' })
  key: string;

  @ApiProperty({ example: 1 })
  partNumber: number;

  @ApiProperty({ example: 'uploadId' })
  uploadId: string;
}
