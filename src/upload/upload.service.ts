import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException('Missing AWS configuration');
    }

    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async getPresignedUrl(filename: string, fileType: string) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucket) {
      throw new InternalServerErrorException('AWS S3 bucket not configured');
    }
    const key = `listings/${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(filename)}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60, // URL expiration time is 60 seconds
    });

    const fileUrl = `https://${bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }
}
