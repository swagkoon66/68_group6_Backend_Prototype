import { user_role } from "@prisma/client";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
import { CreateNotificationDto } from "../../notification/dto/create-notification.dto";
import { CreateRefreshTokenDto } from "../../refresh-token/dto/create-refresh-token.dto";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    @IsNotEmpty()
    email!: string;
    @IsString()
    @IsNotEmpty()
    passwordHash!: string;
    @IsNotEmpty()
    role!: user_role;
    @IsNotEmpty()
    isActive!: boolean | true;
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
    @IsOptional()
    booking?: CreateBookingDto[];
    @IsOptional()
    notification?: CreateNotificationDto[];
    @IsOptional()
    refreshToken?: CreateRefreshTokenDto[];
}
