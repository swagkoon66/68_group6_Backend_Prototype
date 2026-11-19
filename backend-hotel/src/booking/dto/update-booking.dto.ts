
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNestedBookingDto } from './create-nested-booking.dto';

export class UpdateBookingDto extends PartialType(CreateNestedBookingDto) {
  @ApiPropertyOptional({
    type: [CreateNestedBookingDto],
    description: 'Optional booking details array.',
  })
  booking?: CreateNestedBookingDto[];
}
