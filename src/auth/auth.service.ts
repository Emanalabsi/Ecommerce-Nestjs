import { Body, Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { EmailIsTakenError } from 'src/users/errors/email-is-taken.error';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = createUserDto;
    const checkUserExistence = await this.userService.findUserByEmail(email);
    if (checkUserExistence) {
      throw new EmailIsTakenError();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const token = this.generateJwtToken(savedUser);
    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return savedUser;
  }

  async generateJwtToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '1h' });
  }
}
