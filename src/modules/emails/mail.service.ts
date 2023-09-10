import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as Mailgen from 'mailgen';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(toEmail: string, resetLink: string) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'My NestJS App',
        link: 'https://nestjs-app.com',
      },
    });

    const emailBody = {
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
          'If you did not request a password reset, no further action is required on your part.',
      },
    };

    const emailTemplate = mailGenerator.generate(emailBody);

    await this.mailerService.sendMail({
      to: toEmail,
      subject: 'Password Reset Request',
      html: emailTemplate,
    });

    console.log('Password reset email sent to: %s', toEmail);
  }
}
