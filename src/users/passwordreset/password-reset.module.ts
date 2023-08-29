import { Module } from '@nestjs/common';
import { MailModule } from 'src/emails/mail.module';
import { UserModule } from '../users.module';

@Module({
  imports: [MailModule, UserModule],
})
export class PasswordResetModule {}
