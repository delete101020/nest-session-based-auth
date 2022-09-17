export class CompleteMultipartUploadDto {
  key: string;
  parts: AWS.S3.CompletedPart[];
  uploadId: string;
}
