import { Module } from '@nestjs/common';
import { MailModule } from 'src/modules/emails/mail.module';
import { UserModule } from '../users.module';

@Module({
  imports: [MailModule, UserModule],
})
export class PasswordResetModule {}
