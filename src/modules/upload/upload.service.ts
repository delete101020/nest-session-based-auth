import { parse } from 'path';
import { Injectable } from '@nestjs/common';
import { generateSlug } from '../../common/utils';
import { S3Service } from '../shared/services/s3.service';
import {
  CompleteMultipartUploadDto,
  CreatePresignedURLDto,
  GetMultipartSignedUrlDto,
  InitMultipartUploadDto,
} from './dtos';
import { ObjectType, UploadType } from './models';

@Injectable()
export class UploadService {
  constructor(private _s3Service: S3Service) {}

  async getPresignedURL(data: CreatePresignedURLDto) {
    const { filename, uploadType, objectType, objectId } = data;

    // Get upload path
    const uploadPath = this._getUploadPath({
      uploadType,
      objectType,
      objectId,
    });

    // Process filename
    const [name, extension] = this._getFileExtension(filename);
    const newFilename = `${uploadPath}${generateSlug({
      name,
      len: 6,
    })}${extension}`;

    // Get signed url
    const signedUrl = this._s3Service.getPreSignedUploadUrl(newFilename);
    return {
      filename: newFilename,
      fullUrl: this._s3Service.getUrl(newFilename),
      signedUrl,
    };
  }

  async initMultipartUpload(data: InitMultipartUploadDto) {
    const { filename, uploadType, objectType, objectId } = data;

    // Get upload path
    const uploadPath = this._getUploadPath({
      uploadType,
      objectType,
      objectId,
    });

    // Process filename
    const [name, extension] = this._getFileExtension(filename);
    const newFilename = `${uploadPath}${generateSlug({
      name,
      len: 6,
    })}${extension}`;

    // Init multipart upload
    return this._s3Service.initMultiPartUpload(newFilename);
  }

  async getMultipartSignedUrl(data: GetMultipartSignedUrlDto) {
    const { key, uploadId, partNumber } = data;
    const signedUrl = await this._s3Service.getMultipartSignedUrl({
      key,
      uploadId,
      partNumber,
    });

    return { signedUrl };
  }

  async completeMultipartUpload(data: CompleteMultipartUploadDto) {
    const { key, uploadId, parts } = data;
    return this._s3Service.completeMultiPartUpload({ key, uploadId, parts });
  }

  /** ========== GENERAL ========== */

  // Extends original function to support more specific upload paths
  private _getUploadPath({
    uploadType,
    objectType,
    objectId,
  }: {
    uploadType: UploadType;
    objectType?: ObjectType;
    objectId?: string;
  }): string {
    let uploadPath = this._s3Service.getUploadPath(uploadType);

    if (objectType && objectId) {
      switch (objectType) {
        case ObjectType.PROFILE: {
          uploadPath = `users/${objectId}/${uploadPath}`;
        }
      }
    }

    return uploadPath;
  }

  private _getFileExtension(filename: string) {
    return [parse(filename).name, parse(filename).ext];
  }
}
