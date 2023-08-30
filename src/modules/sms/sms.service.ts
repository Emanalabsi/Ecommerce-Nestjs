import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio.Twilio;
  constructor(private configService: ConfigService) {
    this.client = Twilio(
      configService.get<string>('TWILIO_ACCOUNT_SID'),
      configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSMS(text: string): Promise<any> {
    return this.client.messages.create({
      body: text,
      from: this.configService.get('TWILIO_FROM'),
      to: this.configService.get('TWILIO_TO'),
    });
  }
}
