import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MailModule } from 'src/modules/emails/mail.module';
import { UserModule } from '../users.module';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [MailModule, UserModule, AuthModule],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
