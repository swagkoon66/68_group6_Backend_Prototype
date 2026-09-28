import { booking_status, room } from "@prisma/client";
import { room_image } from "@prisma/client";
export class CreateRoomDto {
    id!: string;
    name!: string;
    description?: string;
    capacity!: number;
    pricePerNight!: number;
    isActive?: boolean;
    bookingStatus?: XXX // enum from database
    roomImages?: XXX // room_image from "room_image" table in database
    /* IGNORED createdAt and updatedAt*/
}
