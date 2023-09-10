//this is only for testing purposes rn
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('image')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async imageUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    const result = await this.cloudinaryService.uploadFile(file);
    return result.secure_url;
  }
}
