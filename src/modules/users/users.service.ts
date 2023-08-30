import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { UserNotFound } from 'src/common/errors/user-not-found.error';
import { SmsService } from 'src/modules/sms/sms.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private smsService: SmsService,
  ) {}

  async findUserByEmail(email: string) {
    return this.userRepository.findBy({ email });
  }

  async findUserWithResetToken(resetToken: string) {
    return this.userRepository.findBy({ resetToken });
  }

  async createUser({ ...createUserDto }: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async validatePassword(storedPassword, enteredPassword) {
    return await bcrypt.compare(storedPassword, enteredPassword);
  }

  async storeSmsCode(userId: number, smsCode: string) {
    const user = await this.userRepository.findBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }
    user[0].smsCode = smsCode;
    user[0].has2FA = true;
  }

  async enable2FA(userId) {
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.storeSmsCode(userId, token);
  }

  async sendSmsCode(userId: number) {
    const smsCode = this.getSmsCode(userId);
    await this.smsService.sendSMS(`Your PIN Code is: ${smsCode} `);
  }

  async getSmsCode(userId) {
    const user = await this.userRepository.findBy({ id: userId });
    if (!user) {
      throw new UserNotFound();
    }
    return user[0].smsCode;
  }

  async validateSmsCode(userId: number, smsCode: string): Promise<boolean> {
    const storedSmsCode = await this.getSmsCode(userId);
    return smsCode === storedSmsCode;
  }

  async setPhoneNumber(email: string, phone: number) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UserNotFound();
    }
    if (user[0].phoneNumber === null) {
      user[0].phoneNumber = phone;
    }
    this.saveUser(user[0]);
  }
}
