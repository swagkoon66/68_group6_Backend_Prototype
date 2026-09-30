import { notification_type } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    id!:string;
    @IsString()
    @IsNotEmpty()
    userId!: string;
    @IsString()
    @IsOptional()
    bookingId?: string;
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
