
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshToken: RefreshTokenService,
    private readonly roomService: RoomService,
    private readonly notificationService: NotificationService,
  ) {}

  private readonly logger = new Logger('BookingService');

  // Check whether the requested dates are valid
  private validateDates(checkIn: Date, checkOut: Date): void {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end
    ) {
      throw new BadRequestException(
        'Check-in must be a valid date before check-out',
      );
    }
  }

  // Check whether another active booking overlaps these dates
  private async hasDateConflict(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: number,
  ): Promise<boolean> {
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        room_id: roomId,
        status: {
          in: ['PENDING', 'APPROVED', 'PAID'],
        },
        check_in: {
          lt: checkOut,
        },
        check_out: {
          gt: checkIn,
        },
        ...(excludeBookingId !== undefined
          ? { id: { not: excludeBookingId } }
          : {}),
      },
    });

    return conflictingBooking !== null;
  }
  

  // ADMIN: Create a booking
  async create(createBookingDto: CreateBookingDto) {
    const roomId = createBookingDto.roomId;

    if (roomId == null) {
      throw new BadRequestException('Room ID is required');
    }

    this.validateDates(
      createBookingDto.checkIn,
      createBookingDto.checkOut,
    );

    const room = await this.roomService.findARoom(roomId);

    if (!room) {
      throw new NotFoundException('Room does not exist');
    }

    if (!room.is_active) {
      throw new BadRequestException('Room is not available');
    }

    // Validate guest count
    if (
      !Number.isInteger(createBookingDto.guest) ||
      createBookingDto.guest < 1
    ) {
      throw new BadRequestException(
        'Guest count must be at least 1',
      );
    }

    if (createBookingDto.guest > room.capacity) {
      throw new BadRequestException(
        'Guest count exceeds room capacity',
      );
    }
    const nights =
      (createBookingDto.checkOut.getTime() -
        createBookingDto.checkIn.getTime()) /
      (1000 * 60 * 60 * 24);

    const pricePerNight = Number(room.price_per_night);
    const totalAmount = pricePerNight * nights;

    const hasConflict = await this.hasDateConflict(
      roomId,
      createBookingDto.checkIn,
      createBookingDto.checkOut,
    );

    if (hasConflict) {
      throw new BadRequestException(
        'The room is already booked for the selected dates',
      );
    }

    return this.prisma.booking.create({
      data: {
        user_id: createBookingDto.userId,
        room_id: roomId,
        check_in: createBookingDto.checkIn,
        check_out: createBookingDto.checkOut,
        guest: createBookingDto.guest,
        status: createBookingDto.status,
        price_per_night: pricePerNight,
        total_amount: totalAmount,
        notification: createBookingDto.notification
          ? {
              create: {
                user_id: createBookingDto.notification.userId,
                type: createBookingDto.notification.type,
                message: createBookingDto.notification.message,
                is_read: createBookingDto.notification.isRead,
                created_at: createBookingDto.notification.createdAt,
              },
            }
          : undefined,
      },
    });
  }

  // USER: Create a booking
  async createForUser(
    jwtOfUser: { token: string },
    createBookingDto: CreateBookingDto,
  ) {
    this.validateDates(
      createBookingDto.checkIn,
      createBookingDto.checkOut,
    );

    if (!jwtOfUser?.token) {
      throw new UnauthorizedException('User token is missing');
    }

    const tokenExists = await this.refreshToken.findOneFromToken(
      jwtOfUser.token,
    );

    if (!tokenExists) {
      throw new UnauthorizedException('Invalid user token');
    }

    const roomId = createBookingDto.roomId;

    if (roomId == null) {
      throw new BadRequestException('Room ID is required');
    }

    const room = await this.roomService.findARoom(roomId);

    if (!room) {
      throw new NotFoundException('Room does not exist');
    }

    if (!room.is_active) {
      throw new BadRequestException('Room is not available');
    }
    // Validate guest count
    if (!Number.isInteger(createBookingDto.guest) || createBookingDto.guest < 1) {
      throw new BadRequestException(
        'Guest count must be at least 1',
      );
    }

    if (createBookingDto.guest > room.capacity) {
      throw new BadRequestException(
        'Guest count exceeds room capacity',
      );
    }
    const nights = (createBookingDto.checkOut.getTime() - createBookingDto.checkIn.getTime()) /
    (1000 * 60 * 60 * 24);

    const pricePerNight = Number(room.price_per_night);
    const totalAmount = pricePerNight * nights;

    const hasConflict = await this.hasDateConflict(
      roomId,
      createBookingDto.checkIn,
      createBookingDto.checkOut,
    );

    if (hasConflict) {
      throw new BadRequestException(
        'The room is already booked for the selected dates',
      );
    }

    // Existing user-ID mapping is retained for now.
    // We should verify the refresh-token return structure before correcting it.
    const userID = tokenExists ? tokenExists.user_id : undefined;

    const now = new Date();

    return this.prisma.booking.create({
      data: {
        user_id: userID,
        room_id: roomId,
        check_in: createBookingDto.checkIn,
        check_out: createBookingDto.checkOut,
        guest: createBookingDto.guest,
        status: createBookingDto.status,
        price_per_night: pricePerNight,
        total_amount: totalAmount,
        created_at: now,
        updated_at: now,
        notification: createBookingDto.notification
          ? {
              create: {
                user_id: createBookingDto.notification.userId,
                type: createBookingDto.notification.type,
                message: createBookingDto.notification.message,
                is_read: createBookingDto.notification.isRead,
                created_at: createBookingDto.notification.createdAt,
              },
            }
          : undefined,
      },
    });
  }

  // Get all bookings
  async findAll() {
    this.logger.log('Returning all bookings');
    return this.prisma.booking.findMany();
  }

  // Get all bookings belonging to a user
  async findAllForUser(jwtOfUser: { token: string }) {
  if (!jwtOfUser?.token) {
    throw new UnauthorizedException('User token is missing');
  }

  const tokenExists = await this.refreshToken.findOneFromToken(
    jwtOfUser.token,
  );

  if (!tokenExists) {
    throw new UnauthorizedException('Invalid user token');
  }

  return this.prisma.booking.findMany({
    where: { user_id: tokenExists.user_id },
  });
}

  // Get one booking
  async findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }

  // Get one booking belonging to a user
  async findOneForUser(
  jwtOfUser: { token: string },
  bookingID: number,
) {
  if (!jwtOfUser?.token) {
    throw new UnauthorizedException('User token is missing');
  }

  const tokenExists = await this.refreshToken.findOneFromToken(
    jwtOfUser.token,
  );

  if (!tokenExists) {
    throw new UnauthorizedException('Invalid user token');
  }

  return this.prisma.booking.findFirst({
    where: {
      id: bookingID,
      user_id: tokenExists.user_id,
    },
  });
}

  // Update a booking
  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const existingBooking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      throw new NotFoundException('Booking does not exist');
    }

    const roomId = updateBookingDto.roomId ?? existingBooking.room_id;

    const checkIn = updateBookingDto.checkIn
      ? new Date(updateBookingDto.checkIn)
      : existingBooking.check_in;

    const checkOut = updateBookingDto.checkOut
      ? new Date(updateBookingDto.checkOut)
      : existingBooking.check_out;

    if (roomId == null) {
      throw new BadRequestException('Room ID is required');
    }

    this.validateDates(checkIn, checkOut);
        // Validate guest count when provided
    const room = await this.roomService.findARoom(roomId);
    if (!room) {
        throw new NotFoundException('Room does not exist');
    }

    if (!room.is_active) {
        throw new BadRequestException('Room is inactive');
    }

    // Validate guest count
    const guest = updateBookingDto.guest ?? existingBooking.guest;

    if (!Number.isInteger(guest) || guest < 1) {
      throw new BadRequestException(
        'Guest count must be at least 1',
      );
    }

    if (guest > room.capacity) {
      throw new BadRequestException(
        'Guest count exceeds room capacity',
      );
    }

    // Calculate booking price using the room's actual price
    const nights =
      (checkOut.getTime() - checkIn.getTime()) /
      (1000 * 60 * 60 * 24);

    const pricePerNight = Number(room.price_per_night);
    const totalAmount = pricePerNight * nights;

    const hasConflict = await this.hasDateConflict(
      roomId,
      checkIn,
      checkOut,
      id,
    );

    if (hasConflict) {
      throw new BadRequestException(
        'The room is already booked for the selected dates',
      );
    }

    const updateBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        user_id: updateBookingDto.userId,
        room_id: updateBookingDto.roomId,
        check_in: updateBookingDto.checkIn,
        check_out: updateBookingDto.checkOut,
        guest: updateBookingDto.guest,
        status: updateBookingDto.status,
        price_per_night: pricePerNight,
        total_amount: totalAmount,
        updated_at: new Date(),
      },
    });

    await this.notificationService.create({
      userId: updateBooking.user_id!,
      bookingId: updateBooking.id,
      type: 'BOOKING_CREATED',
      message: 'A booking has been updated',
      isRead: false,
      createdAt: new Date(),
    });

    return updateBooking;
  }

  // Delete a booking
  async remove(id: number) {
    const removeBooking = await this.prisma.booking.delete({
      where: { id },
    });

    await this.notificationService.create({
      userId: removeBooking.user_id!,
      bookingId: removeBooking.id,
      type: 'BOOKING_CANCELLED',
      message: 'A booking has been cancel',
      isRead: false,
      createdAt: new Date(),
    });

    return removeBooking;
  }
}
