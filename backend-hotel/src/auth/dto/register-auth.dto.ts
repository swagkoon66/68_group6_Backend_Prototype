import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, MinLength  } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    @IsString()
    @IsNotEmpty()
    password!: string;
}
