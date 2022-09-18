import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JoiValidationPipe } from '../../common/pipes';
import { AuthenticatedGuard } from '../auth/guards';
import {
  CreatePresignedURLDto,
  InitMultipartUploadDto,
  GetMultipartSignedUrlDto,
  CompleteMultipartUploadDto,
} from './dtos';
import {
  CompleteMultipartUploadSchema,
  CreatePresignedURLSchema,
  GetMultipartSignedUrlSchema,
  InitMultipartUploadSchema,
} from './schemas';
import { UploadService } from './upload.service';

@UseGuards(AuthenticatedGuard)
@Controller('uploads')
export class UploadController {
  constructor(private _uploadService: UploadService) {}

  @Post('presigned-url')
  async createPresignedURL(
    @Body(new JoiValidationPipe(CreatePresignedURLSchema))
    data: CreatePresignedURLDto,
  ) {
    return this._uploadService.getPresignedURL(data);
  }

  @Post('multipart/init')
  async initMultipartUpload(
    @Body(new JoiValidationPipe(InitMultipartUploadSchema))
    data: InitMultipartUploadDto,
  ) {
    return this._uploadService.initMultipartUpload(data);
  }

  @Post('multipart/presigned-url')
  async getMultipartSignedUrl(
    @Body(new JoiValidationPipe(GetMultipartSignedUrlSchema))
    data: GetMultipartSignedUrlDto,
  ) {
    return this._uploadService.getMultipartSignedUrl(data);
  }

  @Post('multipart/complete')
  async completeMultipartUpload(
    @Body(new JoiValidationPipe(CompleteMultipartUploadSchema))
    data: CompleteMultipartUploadDto,
  ) {
    return this._uploadService.completeMultipartUpload(data);
  }
}
