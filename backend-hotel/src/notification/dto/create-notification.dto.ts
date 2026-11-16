import { notification_type } from "@prisma/client";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateNotificationDto {

    @ApiProperty({ description: 'Admin ID associated with the notification', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    userId!: number;

    @ApiProperty({ description: 'Booking ID associated with the booking', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    bookingId!: number;

    @ApiProperty({ description: 'Type of the notification', example: 'BOOKING_CONFIRMED' })
    @IsNotEmpty()
    type!: notification_type;

    @ApiProperty({ description: 'Message of the notification', example: 'Your booking has been confirmed.' })
    @IsString()
    @IsNotEmpty()
    message!: string;

    @ApiProperty({ description: 'Indicates if the notification has been read', example: false })
    @IsBoolean()
    @IsNotEmpty()
    isRead!: boolean;

    @ApiProperty({ description: 'Creation date of the notification', example: '2024-07-01T14:00:00Z' })
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
}
