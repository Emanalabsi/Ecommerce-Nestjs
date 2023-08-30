import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/modules/users/entities/user.entity';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}
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
