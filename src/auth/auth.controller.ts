import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/user-create.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const user = await this.authService.register(createUserDto);

    const token = this.authService.generateJwtToken(user);
    response.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return response.json({ message: 'Registration successful', user });
  }
}
