import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateRefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
    @IsString()
    @IsNotEmpty()
    userId!: string;
    @IsString()
    @IsNotEmpty()
    tokenHash!: string;
    @IsDate()
    @IsNotEmpty()
    expiresAt!: Date;
    @IsDate()
    @IsNotEmpty()
    revokedAt!: Date;
}