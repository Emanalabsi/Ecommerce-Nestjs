import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller('reset-password')
export class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}
  @Post()
  async resetPassword(@Body() token: string, newPassword: string) {
    await this.passwordResetService.resetPasswordWithToken(token, newPassword);
    return { message: 'Password reset successful' };
  }
}
