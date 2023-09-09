import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { CLoudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService, CLoudinaryProvider],
  exports: [CloudinaryService, CLoudinaryProvider],
})
export class CloudinaryModule {}
