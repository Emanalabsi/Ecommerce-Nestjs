import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CLoudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ConfigModule, MulterModule.register()],
  providers: [CloudinaryService, CLoudinaryProvider],
  controllers: [CloudinaryController],
  exports: [],
})
export class CloudinaryModule {}
