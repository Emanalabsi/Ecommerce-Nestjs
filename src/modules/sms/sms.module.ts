import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';
import * as Twilio from 'twilio';

@Module({
  imports: [ConfigModule],
  exports: [SmsService],
  providers: [
    SmsService,
    {
      provide: 'TwilioClient',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const accountSid = configService.get('TWILIO_ACCOUNT_SID');
        const authToken = configService.get('TWILIO_AUTH_TOKEN');
        const twilioClient = Twilio(accountSid, authToken);
        return twilioClient;
      },
    },
  ],
})
export class SmsModule {}
