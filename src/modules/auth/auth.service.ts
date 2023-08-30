import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/user-create.dto';
import { EmailIsTakenError } from 'src/common/errors/email-is-taken.error';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { PasswordsDoesntMatch } from 'src/common/errors/passwords-not-match.error';
import { UserNotFound } from 'src/common/errors/user-not-found.error';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.findUserByEmail(email);
    if (user[0]?.email === createUserDto.email) {
      throw new EmailIsTakenError();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return savedUser;
  }

  async login(email, password) {
    const user = await this.userService.findUserByEmail(email);
    if (user[0]?.email !== email) {
      throw new UserNotFound();
    }

    const isMatch = this.userService.validatePassword(
      password,
      user[0].password,
    );

    if (!isMatch) {
      throw new PasswordsDoesntMatch();
    }
    return user;
  }

  async GoogleLogin(req) {
    if (!req.user) {
      throw new UserNotFound();
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async verifyUser(email, password) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UserNotFound();
    }

    if (!this.userService.validatePassword(password, user[0].password)) {
      throw new Error('Invalid password');
    }
  }

  async loginUserWith2FA(email, smsCode) {
    const user = await this.userService.findUserByEmail(email);

    await this.userService.enable2FA(user[0].id);

    await this.userService.sendSmsCode(user[0].id);

    if (!this.userService.validateSmsCode(user[0].id, smsCode)) {
      throw new Error('Invalid SMS code');
    }
    return true;
  }
}
