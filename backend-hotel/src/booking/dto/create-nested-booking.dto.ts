import { booking_status } from '@prisma/client';
import {
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNestedBookingDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  roomId?: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  checkIn!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  checkOut!: Date;

  @IsNumber()
  @IsNotEmpty()
  guest!: number;

  @IsEnum(booking_status)
  @IsNotEmpty()
  status!: booking_status;

  @IsNumber()
  @IsNotEmpty()
  pricePerNight!: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  updatedAt!: Date;
}