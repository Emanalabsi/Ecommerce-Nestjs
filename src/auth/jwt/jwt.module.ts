import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtCustomeModule {}
