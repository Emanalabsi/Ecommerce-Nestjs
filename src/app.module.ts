import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MailModule } from './modules/emails/mail.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SmsModule } from './modules/sms/sms.module';
import { User } from './modules/users/entities/user.entity';
import { PasswordResetModule } from './modules/users/passwordreset/password-reset.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailModule,
    PasswordResetModule,
    PaymentsModule,
    CloudinaryModule,
    SmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
