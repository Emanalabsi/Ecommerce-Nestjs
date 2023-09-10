import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/user-create.dto';
import { EmailIsTakenError } from 'src/common/errors/email-is-taken.error';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { PasswordsDoesntMatch } from 'src/common/errors/passwords-not-match.error';
import { UserNotFound } from 'src/common/errors/user-not-found.error';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    //check user
    const user = await this.userService.findUserByEmail(email);

    if (user[0]?.email === createUserDto.email) {
      throw new EmailIsTakenError();
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser);

    return {
      newUser,
      token,
    };
  }

  async login(email: string, password: string) {
    //check user
    const user = await this.userService.findUserByEmail(email);

    if (user[0]?.email !== email) {
      throw new UserNotFound();
    }

    const isMatch = await bcrypt.compare(user[0].password, password);

    if (!isMatch) {
      throw new PasswordsDoesntMatch();
    }
    //generate token
    const token = this.generateToken(user[0]);

    return { user, token };
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

  async generateToken(user: User) {
    const token = this.jwtService.signAsync(user);
    return token;
  }
}
