import { PartialType } from '@nestjs/mapped-types';
import { CreateNestedBookingDto } from "../../booking/dto/create-nested-booking.dto";

export class UpdateBookingDto extends PartialType(CreateNestedBookingDto) {
    booking?: CreateNestedBookingDto[];
}
