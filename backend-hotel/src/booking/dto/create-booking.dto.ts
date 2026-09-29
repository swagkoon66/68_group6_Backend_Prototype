import { booking_status } from "@prisma/client";
import { CreateNotificationDto } from "../../notification/dto/create-notification.dto";

export class CreateBookingDto {
    id!: string;
    userId!: string;
    roomId!: string;
    checkIn!: Date;
    checkOut!: Date;
    guest!: number;
    status!: booking_status;
    pricePerNight!: number;
    totalAmount!: number;
    createdAt!: Date;
    updatedAt!: Date;
    notification!: CreateNotificationDto;
}
