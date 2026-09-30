import { CreateRoomImageDto } from "../../room-image/dto/create-room-image.dto";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsNumber()
    @IsNotEmpty()
    capacity!: number;
    @IsNumber()
    @IsNotEmpty()
    pricePerNight!: number;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    @IsOptional()
    booking?: CreateBookingDto[] // booking from "booking" table in database
    @IsOptional()
    roomImage?: CreateRoomImageDto[] // room_image from "room_image" table in database
    /* IGNORED createdAt and updatedAt*/
}
