import { IsEmail, IsNotEmpty, IsAlphanumeric, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Min(3)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Min(5)
  password: string;
}
