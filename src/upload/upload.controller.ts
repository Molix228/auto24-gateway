import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // axios.get('https://localhost:3000/api/upload/presigned?filename=test.jpg&fileType=image/jpeg')
  //returns filename: string, fileType: string
  @UseGuards(JwtAuthGuard)
  @Get('presigned')
  async getPresignedUrl(
    @Req() req,
    @Query('filename') filename: string,
    @Query('fileType') fileType: string,
  ) {
    return this.uploadService.getPresignedUrl(
      filename,
      fileType,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadImages(files, req.user.userId);
  }
}
