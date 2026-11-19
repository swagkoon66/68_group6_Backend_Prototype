
import { notification_type } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID associated with the notification',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty({
    description: 'Booking ID associated with the notification',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  bookingId!: number;

  @ApiProperty({
    description: 'Type of notification',
    enum: notification_type,
    example: notification_type.BOOKING_CREATED,
  })
  @IsEnum(notification_type)
  @IsNotEmpty()
  type!: notification_type;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your booking has been created.',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({
    description: 'Indicates whether the notification has been read',
    example: false,
  })
  @IsBoolean()
  isRead!: boolean;

  @ApiProperty({
    description: 'Creation date of the notification',
    example: '2026-11-19T14:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;
}
