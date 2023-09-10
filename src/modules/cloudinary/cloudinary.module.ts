import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CLoudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService, CLoudinaryProvider],
  controllers: [CloudinaryController],
  exports: [],
})
export class CloudinaryModule {}
