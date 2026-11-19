
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRefreshTokenDto {
  @ApiPropertyOptional({
    example: 7,
    description: 'ID of the user associated with this refresh token',
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    example: 'hashed-refresh-token-value',
    description: 'Stored refresh token hash',
  })
  @IsString()
  @IsNotEmpty()
  tokenHash!: string;

  @ApiProperty({
    example: '2026-11-20T12:00:00.000Z',
    description: 'Refresh token expiration date',
  })
  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;

  @ApiPropertyOptional({
    example: null,
    description: 'Date the token was revoked, or null if not revoked',
    type: Date,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  revokedAt?: Date;
}
