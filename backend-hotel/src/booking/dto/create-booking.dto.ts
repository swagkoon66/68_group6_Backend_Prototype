import { booking_status } from "@prisma/client";
import { CreateNotificationDto } from "../../notification/dto/create-notification.dto";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateBookingDto {
    /* I will leave the old one here*/
    // @IsString()
    // @IsNotEmpty()
    // id!: string;
    @IsNumber()
    @IsOptional()
    userId?: number;
    @IsNumber()
    @IsOptional()
    roomId?: number;
    @IsDate()
    @IsNotEmpty()
    checkIn!: Date;
    @IsDate()
    @IsNotEmpty()
    checkOut!: Date;
    @IsNumber()
    @IsNotEmpty()
    guest!: number;
    @IsNotEmpty()
    status!: booking_status;
    @IsNumber()
    @IsNotEmpty()
    pricePerNight!: number;
    @IsNumber()
    @IsNotEmpty()
    totalAmount!: number;
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
    @IsNotEmpty()
    notification!: CreateNotificationDto;
}
