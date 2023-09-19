import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { SmsModule } from 'src/modules/sms/sms.module';

@Module({
  imports: [
    UserModule,
    SmsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '10h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
