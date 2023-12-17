import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HRM } from '@helpers';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';

@Injectable()
export class PublicService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  private getContentType(fileName: string): string {
    const contentType = mimeTypes.lookup(fileName);
    return contentType || 'application/octet-stream';
  }

  async upload(fileName: string, file: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: HRM.BUCKET,
          Key: fileName,
          Body: file,
          ContentType: this.getContentType(fileName),
        }),
      );
      const uploadedFilePath = this.generateS3FileUrl(fileName);
      return {
        message: 'File  added Successfully...',
        data: {
          filePath: uploadedFilePath,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  generateS3FileUrl(fileName: string): string {
    const bucketName = 'hrm-onpoint-test';
    const region = 'ap-south-1'; // Your AWS region

    return `https://hrm-onpoint-test.s3.${region}.amazonaws.com/${fileName}`;
  }
}
