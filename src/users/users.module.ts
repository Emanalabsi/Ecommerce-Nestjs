import { Module } from '@nestjs/common';
import { UserService } from './users.service';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
