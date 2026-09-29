import { booking_status, room } from "@prisma/client";
import { room_image } from "@prisma/client";
import { CreateRoomImageDto } from "../../room-image/dto/create-room-image.dto";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
export class CreateRoomDto {
    id!: string;
    name!: string;
    description?: string;
    capacity!: number;
    pricePerNight!: number;
    isActive?: boolean;
    booking?: CreateBookingDto[] // booking from "booking" table in database
    roomImage?: CreateRoomImageDto[] // room_image from "room_image" table in database
    /* IGNORED createdAt and updatedAt*/
}
