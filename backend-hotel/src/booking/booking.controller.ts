
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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@ApiTags('booking')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('admin')
  @Roles(user_role.ADMIN)
  @ApiOperation({
    summary: 'Create a booking (Admin)',
    description:
      'Allows an administrator to create a booking for a specified user. The service calculates the booking price from the room price and stay duration.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid dates, guest count, or room availability.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only administrators can create bookings through this endpoint.' })
  @ApiResponse({ status: 404, description: 'Room does not exist.' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Post()
  @Roles(user_role.USER)
  @ApiOperation({
    summary: 'Create a booking (User)',
    description:
      'Creates a booking for the authenticated user. The user ID is obtained from the bearer token; the service calculates the booking price automatically.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid dates, guest count, or room availability.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only regular users can use this endpoint.' })
  @ApiResponse({ status: 404, description: 'Room does not exist.' })
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

  @Get()
  @Roles(user_role.ADMIN)
  @ApiOperation({
    summary: 'Get all bookings (Admin)',
    description: 'Returns all bookings in the system.',
  })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only administrators can access all bookings.' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('my')
  @Roles(user_role.USER)
  @ApiOperation({
    summary: 'Get my bookings (User)',
    description: 'Returns bookings belonging to the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only regular users can use this endpoint.' })
  findAllForUser(
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization?.replace(/^Bearer\s+/i, '');

    return this.bookingService.findAllForUser({ token });
  }

  @Get(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({
    summary: 'Get a booking by ID (Admin)',
    description: 'Returns the booking matching the specified ID.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully. Returns null if no matching booking exists.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only administrators can access this endpoint.' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({
    summary: 'Update a booking (Admin)',
    description:
      'Updates the supplied booking fields. The service validates the room, dates, guest count, and booking conflicts, then recalculates the booking price.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid dates, guest count, or room availability.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only administrators can update bookings.' })
  @ApiResponse({ status: 404, description: 'Booking or room does not exist.' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({
    summary: 'Delete a booking (Admin)',
    description: 'Deletes the specified booking and creates a cancellation notification.',
  })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Only administrators can delete bookings.' })
  @ApiResponse({ status: 404, description: 'Booking does not exist.' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
