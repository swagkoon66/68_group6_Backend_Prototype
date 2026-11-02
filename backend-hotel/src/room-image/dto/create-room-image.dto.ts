import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateRoomImageDto {
    @IsNumber()
    @IsNotEmpty()
    roomId!: number;
    @IsString()
    @IsNotEmpty()
    url!: string;
    @IsString()
    @IsOptional()
    storageKey?: string;
    @IsString()
    @IsOptional()
    mimeType?: string;
    @IsNumber()
    @IsOptional()
    fileSize?: number;
    @IsBoolean()
    @IsNotEmpty()
    isPrimary!: boolean;
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
}
