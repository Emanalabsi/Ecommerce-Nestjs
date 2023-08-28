import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { EmailIsTakenError } from 'src/utils/errors/email-is-taken.error';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PasswordsDoesntMatch } from 'src/utils/errors/passwords-not-match.error';
import { UserNotFound } from 'src/utils/errors/user-not-found.error';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

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

  async generateJwtToken(user: User) {
    const payload = {
      sub: user.id,
      iss: jwtConstants.JWT_ISSUER,
      aud: jwtConstants.JWT_AUDIENCE,
      email: user.email,
    };
    return jwt.sign(payload, this.configService.get('SECRET_KEY'), {
      expiresIn: jwtConstants.JWT_EXPIRATION_TIME,
    });
  }
}
