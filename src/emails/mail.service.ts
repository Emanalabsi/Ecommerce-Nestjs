import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

@Injectable()
export class MailService {
  constructor(
    private configService: ConfigService,
    private transporter: nodemailer.Transporter,
    private mailGenerator: Mailgen,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.forwardemail.net',
      port: 465,
      secure: true,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASS'),
      },
    });

    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'My NestJS App',
        link: 'https://nestjs-app.com',
      },
    });
  }

  async sendPasswordResetEmail(toEmail: string, resetLink: string) {
    const email = {
      body: {
        name: 'John Appleseed',
        intro:
          'You have received this email because a password reset request for your account was received.',
        action: {
          instructions: 'Click the button below to reset your password:',
          button: {
            color: '#22BC66',
            text: 'Reset your password',
            link: resetLink,
          },
        },
        outro:
          'If you did not request a password reset, no further action is required on your part. .',
      },
    };
    const emailBody = this.mailGenerator.generate(email);

    const info = await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: toEmail,
      subject: 'Password Reset Request',
      html: emailBody,
    });
    console.log('Password reset email sent: %s', info.messageId);
  }
}
