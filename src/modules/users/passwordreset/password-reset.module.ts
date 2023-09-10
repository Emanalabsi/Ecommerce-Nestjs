import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MailModule } from 'src/modules/emails/mail.module';
import { UserModule } from '../users.module';

@Module({
  imports: [MailModule, UserModule, AuthModule],
})
export class PasswordResetModule {}
