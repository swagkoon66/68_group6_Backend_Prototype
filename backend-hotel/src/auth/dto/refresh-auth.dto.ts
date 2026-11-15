
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RefreshAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
