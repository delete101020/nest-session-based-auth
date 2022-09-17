import * as AWS from 'aws-sdk';
import { lookup } from 'mime-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigVar } from '../../../configs';
import {
  CompleteMultipartUploadDto,
  GetMultipartSignedUrlDto,
} from '../../upload/dtos';
import { UploadType } from '../../upload/models';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor(private _configService: ConfigService) {
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: this._configService.get<string>(ConfigVar.AWS_REGION),
      credentials: {
        accessKeyId: this._configService.get<string>(
          ConfigVar.AWS_ACCESS_KEY_ID,
        ),
        secretAccessKey: this._configService.get<string>(
          ConfigVar.AWS_SECRET_ACCESS_KEY,
        ),
      },
      signatureVersion: 'v4',
      httpOptions: { timeout: 0 },
    });
    this.bucket = this._configService.get<string>(ConfigVar.AWS_S3_BUCKET);
    this.region = this._configService.get<string>(ConfigVar.AWS_REGION);
  }

  getPreSignedUploadUrl(filename: string) {
    const params = {
      Bucket: this.bucket,
      Key: filename,
      ContentType: this.getFileType(filename),
      ACL: 'public-read',
      Expires: 60,
    };

    return this.s3.getSignedUrl('putObject', params);
  }

  async initMultiPartUpload(filename: string) {
    const params = {
      Bucket: this.bucket,
      Key: filename,
      ContentType: this.getFileType(filename),
      ACL: 'public-read',
      Expires: new Date(new Date().getTime() + 1.5 * 60),
    };

    return this.s3.createMultipartUpload(params).promise();
  }

  async getMultipartSignedUrl(data: GetMultipartSignedUrlDto) {
    const { key, partNumber, uploadId } = data;
    const params = {
      Bucket: this.bucket,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
    };

    return this.s3.getSignedUrlPromise('uploadPart', params);
  }

  async completeMultiPartUpload(data: CompleteMultipartUploadDto) {
    const { key, parts = [], uploadId } = data;
    const params = {
      Bucket: this.bucket,
      Key: key,
      MultipartUpload: {
        Parts: parts,
      },
      UploadId: uploadId,
    };

    return this.s3.completeMultipartUpload(params).promise();
  }

  /** ========== GENERAL ========== */

  getUrl(filename: string) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filename}`;
  }

  /**
   * Only for general type
   * Custom type must be defined in upload service
   */
  getUploadPath(uploadType: UploadType) {
    switch (uploadType) {
      case UploadType.IMAGE: {
        return `images/`;
      }

      case UploadType.VIDEO: {
        return `videos/`;
      }

      case UploadType.DOCUMENT: {
        return `documents/`;
      }
    }
  }

  getFileType(filename: string) {
    const contentType = lookup(filename);
    return contentType ? contentType : 'application/octet-stream';
  }
}
