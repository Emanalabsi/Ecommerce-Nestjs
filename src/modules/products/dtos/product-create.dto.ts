import { Length, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @Length(1, 255)
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
