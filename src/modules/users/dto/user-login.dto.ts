import { IsEmail, IsNotEmpty, IsAlphanumeric, Min } from 'class-validator';
export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Min(5)
  password: string;
}
