import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class SearchRoomParamDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsNumber()
    @IsOptional()
    capacity?: number;
    @IsNumber()
    @IsOptional()
    pricePerNight?: number;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    @IsDate()
    @IsOptional()
    startDate?: Date;
    @IsDate()
    @IsOptional()
    endDate?: Date;
}
