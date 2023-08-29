import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { MailService } from 'src/emails/mail.service';
import { UserNotFound } from 'src/errors/user-not-found.error';
import { UserService } from '../users.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async initiatePasswordReset(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UserNotFound();
    }
    user[0].resetToken = await this.jwtService.generateJwtToken(user[0]);

    const resetLink = `http://localhost:3000/reset-password/${user[0].resetToken}`;

    await this.mailService.sendPasswordResetEmail(user[0].email, resetLink);
  }

  async resetPasswordWithToken(resetToken: string, newPassword: string) {
    const user = await this.userService.findUserWithResetToken(resetToken);

    if (!user) {
      throw new UserNotFound();
    }
    user[0].password = await bcrypt.hash(newPassword, 10);
    user[0].resetToken = null;
    await this.userService.saveUser(user[0]);
  }
}
