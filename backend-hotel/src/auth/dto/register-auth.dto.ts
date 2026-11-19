
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'John Smith',
    description: 'Full name of the user',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
