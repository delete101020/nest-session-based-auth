import { ApiProperty } from '@nestjs/swagger';

export class CompleteMultipartUploadDto {
  @ApiProperty({ example: 'background.png' })
  key: string;

  @ApiProperty({
    type: Array<{ ETag: string; PartNumber: number }>,
    example: `[
      {
        "ETag": "",
        "PartNumber": 1
      }
    ]`,
    isArray: true,
  })
  parts: AWS.S3.CompletedPart[];

  @ApiProperty({ example: 'uploadId' })
  uploadId: string;
}
