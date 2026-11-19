
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { CreateRoomImageDto } from '../../room-image/dto/create-room-image.dto';
import { CreateNestedBookingDto } from '../../booking/dto/create-nested-booking.dto';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Name of the room',
    example: 'Deluxe Suite',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Description of the room',
    example: 'A spacious suite with a king-size bed.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Maximum guest capacity',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  capacity!: number;

  @ApiProperty({
    description: 'Price per night',
    example: 150.00,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  pricePerNight!: number;

  @ApiPropertyOptional({
    description: 'Whether the room is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Bookings associated with the room',
    type: [CreateNestedBookingDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateNestedBookingDto)
  booking?: CreateNestedBookingDto[];

  @ApiPropertyOptional({
    description: 'Images associated with the room',
    type: [CreateRoomImageDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomImageDto)
  roomImage?: CreateRoomImageDto[];
}
