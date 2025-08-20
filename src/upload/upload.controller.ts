import { Controller, Get, Query } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // axis.get('https://localhost:3000/api/upload/presigned?filename=test.jpg&fileType=image/jpeg')
  //returns filename: string, fileType: string
  // @UseGuards(JwtAuthGuard) should be used if authentication is required
  @Get('presigned')
  async getPresignedUrl(
    @Query('filename') filename: string,
    @Query('fileType') fileType: string,
  ) {
    return this.uploadService.getPresignedUrl(filename, fileType);
  }
}
