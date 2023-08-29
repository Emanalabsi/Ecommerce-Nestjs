import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({
  exports: [JwtCustomeModule],
  providers: [JwtService],
})
export class JwtCustomeModule {}
