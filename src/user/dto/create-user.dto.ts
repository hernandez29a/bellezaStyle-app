import {
  IsString,
  MinLength,
  IsEmail,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
//import { ValidRoles } from '../interfaces';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  displayName: string;

  @IsString()
  skinType: string;

  @IsEnum(['M', 'F'])
  gender: ['M', 'F'];

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsNumber()
  age: number;

  @IsString()
  rol: string;

  // TODO hacer esta prueba para el siguiente proyecto
  //@IsEnum(ValidRoles)
  //rol: ValidRoles;

  @IsString()
  @IsOptional()
  img: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
