
import { user_role } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateNestedBookingDto } from '../../booking/dto/create-nested-booking.dto';
import { CreateNotificationDto } from '../../notification/dto/create-notification.dto';
import { CreateRefreshTokenDto } from '../../refresh-token/dto/create-refresh-token.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'John Smith', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'hashed-password-value',
    description: 'Password hash stored for the user',
  })
  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  @ApiProperty({
    enum: user_role,
    example: user_role.USER,
    description: 'User role',
  })
  @IsNotEmpty()
  role!: user_role;

  @ApiProperty({ example: true, description: 'Whether the account is active' })
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({
    example: '2026-11-19T12:00:00.000Z',
    description: 'User creation date',
  })
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty({
    example: '2026-11-19T12:00:00.000Z',
    description: 'Last update date',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;

  @ApiPropertyOptional({
    type: [CreateNestedBookingDto],
    description: 'Optional bookings associated with the user',
  })
  @IsOptional()
  booking?: CreateNestedBookingDto[];

  @ApiPropertyOptional({
    type: [CreateNotificationDto],
    description: 'Optional notifications associated with the user',
  })
  @IsOptional()
  notification?: CreateNotificationDto[];

  @ApiPropertyOptional({
    type: [CreateRefreshTokenDto],
    description: 'Optional refresh tokens associated with the user',
  })
  @IsOptional()
  refreshToken?: CreateRefreshTokenDto[];
}
