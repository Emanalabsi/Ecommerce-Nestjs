import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { EmailIsTakenError } from 'src/errors/email-is-taken.error';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { PasswordsDoesntMatch } from 'src/errors/passwords-not-match.error';
import { UserNotFound } from 'src/errors/user-not-found.error';

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
    const isMatch = await bcrypt.compare(password, user[0].password);
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
}
