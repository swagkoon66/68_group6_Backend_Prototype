import { CreateRoomImageDto } from "../../room-image/dto/create-room-image.dto";
import { CreateNestedBookingDto } from "../../booking/dto/create-nested-booking.dto";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, IsDecimal } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateRoomDto {

    @ApiProperty({ description: 'Name of the room', example: 'Deluxe Suite' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({ description: 'Description of the room', example: 'A spacious suite with a king-size bed and a beautiful view.' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Capacity of the room', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    capacity!: number;

    @ApiProperty({ description: 'Price per night for the room', example: 150.00 })
    @IsNumber()
    @IsNotEmpty()
    pricePerNight!: number;
    
    @ApiPropertyOptional({ description: 'Indicates if the room is active', example: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Indicates if the room is available', example: true })
    @IsOptional()
    booking?: CreateNestedBookingDto[] // booking from "booking" table in database    

    @ApiPropertyOptional({ description: 'Images associated with the room', type: [CreateRoomImageDto] })
    @IsOptional()
    roomImage?: CreateRoomImageDto[] // room_image from "room_image" table in database
}
