
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRoomParamDto {
  @ApiPropertyOptional({
    example: 'Deluxe',
    description: 'Search rooms by name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter by room capacity',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Filter by price per night',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '2026-12-01T00:00:00.000Z',
    description: 'Booking search start date',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2026-12-05T00:00:00.000Z',
    description: 'Booking search end date',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
