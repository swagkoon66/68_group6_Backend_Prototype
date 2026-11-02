import { notification_type } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    userId!: number;
    @IsNumber()
    @IsNotEmpty()
    bookingId!: number;
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
