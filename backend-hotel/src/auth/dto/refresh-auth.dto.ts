
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginAuthDto } from './login-auth.dto';

export class RefreshAuthDto extends LoginAuthDto {
  @ApiProperty({
    example: 'your-existing-jwt-token',
    description: 'Existing refresh token used to generate a replacement token',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
