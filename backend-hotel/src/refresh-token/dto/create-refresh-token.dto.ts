import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateRefreshTokenDto {
    @IsNumber()
    @IsNotEmpty()
    userId!: number;
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