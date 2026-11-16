
import { booking_status } from '@prisma/client';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNotificationDto } from '../../notification/dto/create-notification.dto';

export class CreateBookingDto {
  @ApiPropertyOptional({
    description: 'User ID associated with the booking (Admin only)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: 'Room ID associated with the booking',
    example: 101,
  })
  @IsNumber()
  @IsNotEmpty()
  roomId!: number;

  @ApiProperty({
    description: 'Check-in date',
    example: '2026-12-01T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  checkIn!: Date;

  @ApiProperty({
    description: 'Check-out date',
    example: '2026-12-05T11:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  checkOut!: Date;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  guest!: number;

  @ApiPropertyOptional({
    description: 'Booking status (defaults to PENDING)',
    enum: booking_status,
    example: booking_status.PENDING,
  })
  @IsOptional()
  @IsEnum(booking_status)
  status?: booking_status;

  @ApiPropertyOptional({
    description: 'Optional notification details',
    type: CreateNotificationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNotificationDto)
  notification?: CreateNotificationDto;
}
