
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateRefreshTokenDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  tokenHash!: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt!: Date;

  @IsOptional()
  @IsDate()
  revokedAt?: Date;
}
