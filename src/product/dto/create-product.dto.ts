import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(4)
  brand: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsString()
  skinTypeProduct: string;

  @IsString()
  @IsOptional()
  img: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
