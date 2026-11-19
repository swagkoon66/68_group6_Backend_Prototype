
import { ApiProperty } from '@nestjs/swagger';

export class RoomResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique room ID',
  })
  id!: number;

  @ApiProperty({
    example: 'Deluxe Suite',
    description: 'Name of the room',
  })
  name!: string;

  @ApiProperty({
    example: 'A spacious suite with a king-size bed.',
    nullable: true,
    description: 'Description of the room',
  })
  description!: string | null;

  @ApiProperty({
    example: 2,
    description: 'Maximum guest capacity',
  })
  capacity!: number;

  @ApiProperty({
    example: '150.00',
    description: 'Price per night. Prisma Decimal is serialized as a string.',
  })
  price_per_night!: string;

  @ApiProperty({
    example: true,
    description: 'Whether the room is active',
  })
  is_active!: boolean;

  @ApiProperty({
    example: '2026-11-19T10:00:00.000Z',
    format: 'date-time',
    description: 'Room creation timestamp',
  })
  created_at!: Date;

  @ApiProperty({
    example: '2026-11-19T10:00:00.000Z',
    format: 'date-time',
    description: 'Last update timestamp',
  })
  updated_at!: Date;
}
