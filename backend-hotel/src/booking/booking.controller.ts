
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ADMIN: Create a booking
  @Post('admin')
  @Roles(user_role.ADMIN)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  // USER: Create a booking
  @Post()
  @Roles(user_role.USER)
  createForUser(
    @Headers('authorization') authorization: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const token = authorization?.replace(/^Bearer\s+/i, '');

    return this.bookingService.createForUser(
      { token },
      createBookingDto,
    );
  }

  // ADMIN: Get all bookings
  @Get()
  @Roles(user_role.ADMIN)
  findAll() {
    return this.bookingService.findAll();
  }

  // USER: Get their own bookings
  @Get('my')
  @Roles(user_role.USER)
  findAllForUser(
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization?.replace(/^Bearer\s+/i, '');

    return this.bookingService.findAllForUser({ token });
  }

  // ADMIN: Get one booking
  @Get(':id')
  @Roles(user_role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  // ADMIN: Update a booking
  @Patch(':id')
  @Roles(user_role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  // ADMIN: Delete a booking
  @Delete(':id')
  @Roles(user_role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
