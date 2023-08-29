import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findUserByEmail(email: string) {
    return this.userRepository.findBy({ email });
  }

  findUserWithResetToken(resetToken: string) {
    return this.userRepository.findBy({ resetToken });
  }

  createUser({ ...createUserDto }: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  saveUser(user: User) {
    return this.userRepository.save(user);
  }
}
