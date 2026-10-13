import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateRefreshTokenDto {
    /* I will leave the old one here*/
    // @IsString()
    // @IsNotEmpty()
    // id!: string;
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