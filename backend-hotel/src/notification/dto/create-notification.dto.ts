import { notification_type } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateNotificationDto {
    /* I will leave the old one here*/
    // @IsString()
    // @IsNotEmpty()
    // id!:string;
    @IsNumber()
    @IsNotEmpty()
    userId?: number;
    @IsNumber()
    @IsOptional()
    bookingId?: number;
    @IsNotEmpty()
    type!: notification_type;
    @IsString()
    @IsNotEmpty()
    message!: string;
    @IsBoolean()
    @IsNotEmpty()
    isRead!: boolean;
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
}
