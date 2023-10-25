import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateCategoryDto {
  @IsString()
  @MinLength(4)
  title: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsArray()
  @IsOptional()
  products: Product[];
}
