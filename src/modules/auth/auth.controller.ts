import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/user-create.dto';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '../../common/guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    try {
      const { token, newUser } = await this.authService.register(createUserDto);

      response.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour expiration time
      });

      return response.json({ message: 'Registration successful', newUser });
    } catch (error) {
      return response
        .status(error.status || 500)
        .json({ message: error.message });
    }
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto, @Res() response: Response) {
    try {
      const { token, user } = await this.authService.login(
        userLoginDto.email,
        userLoginDto.password,
      );

      response.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      return response.json({ message: 'You are now logged in', user });
    } catch (error) {
      return response
        .status(error.status || 500)
        .json({ message: error.message });
    }
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() _req) {}

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req) {
    const user = await this.authService.GoogleLogin(req);
    return user;
  }

  // @Post('login-2fa')
  // async loginUserWith2FA(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  //   @Body('smsCode') smsCode: string,
  // ) {
  //   await this.authService.loginUserWith2FA(email, password, smsCode);
  //   return { message: 'Logged in with 2FA and SMS code sent' };
  // }

  // @Post('challenge/validate')
  // async challengeValidate(email, password) {
  //   const user = await this.authService.verifyUser(email, password);
  //   return user;
  // }

  // @Post('otp/generate')
  // async optGenerate(phone) {
  //   await this.authService.loginUserWith2FA(phone);
  // }
}
