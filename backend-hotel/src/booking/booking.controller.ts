import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@UseGuards(RolesGuard, JwtAuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @Roles(user_role.ADMIN)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Post()
  @Roles(user_role.USER)
  createForUser(userJWT: { token: string }, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createForUser(userJWT, createBookingDto);
  }

  @Get()
  @Roles(user_role.ADMIN)
  findAll() {
    return this.bookingService.findAll();
  }

  @Get()
  @Roles(user_role.USER)
  findAllForUser(userJWT: {token: string}) {
    return this.bookingService.findAllForUser(userJWT);
  }

  @Get(':id')
  @Roles(user_role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  @Roles(user_role.ADMIN)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  @Roles(user_role.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
