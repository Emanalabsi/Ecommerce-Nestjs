import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const user = await this.authService.register(createUserDto);

    const token = this.authService.generateJwtToken(user);
    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return response.json({ message: 'Registration successful' });
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() userloginDto: UserLoginDto, @Res() response: Response) {
    const user = await this.authService.login(
      userloginDto.email,
      userloginDto.password,
    );
    const token = this.authService.generateJwtToken(user[0]);
    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return response.json({ message: 'You are now logged in' });
  }
}
