import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService, private refreshToken: RefreshTokenService, private roomService: RoomService, private notificationService: NotificationService) { };
  private readonly logger = new Logger('BookingService');

  async create(createBookingDto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: {
          user_id: createBookingDto.userId,
          room_id: createBookingDto.roomId,
          check_in: createBookingDto.checkIn,
          check_out: createBookingDto.checkOut,
          guest: createBookingDto.guest,
          status: createBookingDto.status,
          price_per_night: createBookingDto.pricePerNight,
          total_amount: createBookingDto.totalAmount,
          created_at: createBookingDto.createdAt,
          updated_at: createBookingDto.updatedAt,
          notification: createBookingDto.notification ? {
            create: {
              user_id: createBookingDto.notification.userId,
              type: createBookingDto.notification.type,
              message: createBookingDto.notification.message,
              is_read: createBookingDto.notification.isRead,
              created_at: createBookingDto.notification.createdAt,
            }
          } : undefined,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid booking data provided");
    }
  }

  async createForUser(jwtOfUser: { token: string }, createBookingDto: CreateBookingDto) {
    try {
      if (createBookingDto.checkIn >= createBookingDto.checkOut || createBookingDto.checkOut <= createBookingDto.checkIn) {
        throw new Error("The given check-in or check-out time is invalid");
      }
      if (jwtOfUser == null) {
        throw new Error("The given token is missing or broken");
      }
      const doesTokenExists = await this.refreshToken.findOneFromToken(jwtOfUser.token);
      if (doesTokenExists == null) {
        throw new Error("User's token does not exits");
      }
      const doesThatRoomExists = await this.roomService.findARoom(createBookingDto.roomId ?? -1);
      if (doesThatRoomExists == null) {
        throw new Error("The room does not exists");
      }
      else if (doesThatRoomExists.is_active == false) {
        throw new Error("The room is not available");
      }
      const userID = await this.refreshToken.findOneFromToken(jwtOfUser.token) ? -1 : undefined;
      await this.roomService.update(doesThatRoomExists.id, { isActive: false })
      return await this.prisma.booking.create({
        data: {
          // id: createBookingDto.id,
          user_id: userID,
          room_id: createBookingDto.roomId,
          check_in: createBookingDto.checkIn,
          check_out: createBookingDto.checkOut,
          guest: createBookingDto.guest,
          status: createBookingDto.status,
          price_per_night: createBookingDto.pricePerNight,
          total_amount: createBookingDto.totalAmount,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          notification: createBookingDto.notification ? {
            create: {
              // id: createBookingDto.notification.id,
              user_id: createBookingDto.notification.userId,
              type: createBookingDto.notification.type,
              message: createBookingDto.notification.message,
              is_read: createBookingDto.notification.isRead,
              created_at: createBookingDto.notification.createdAt,
            }
          } : undefined,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid booking data provided");
    }
  }

  async findAll() {
    this.logger.log(`This action returns all booking`);
    return await this.prisma.booking.findMany();
  }

  async findAllForUser(jwtOfUser: { token: string }) {
    this.logger.log(`This action returns all booking of the user with token ${jwtOfUser.token}`);
    return await this.prisma.booking.findMany({ where: { user_id: await this.refreshToken.findOneFromToken(jwtOfUser.token) ? -1 : undefined } });
  }

  async findOne(id: number) {
    this.logger.log(`This action returns a #${id} booking`);
    return await this.prisma.booking.findUnique({ where: { id } });
  }

  async findOneForUser(jwtOfUser: { token: string }, bookingID: number) {
    this.logger.log(`This action returns a #${bookingID} booking`);
    return await this.prisma.booking.findUnique({ where: { id: bookingID, user_id: await this.refreshToken.findOneFromToken(jwtOfUser.token) ? -1 : undefined } });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    this.logger.log(`This action updates a #${id} booking`);
    const updateBooking = await this.prisma.booking.update({
      where: { id }, data: {
        user_id: updateBookingDto.userId,
        room_id: updateBookingDto.roomId,
        check_in: updateBookingDto.checkIn,
        check_out: updateBookingDto.checkOut,
        guest: updateBookingDto.guest,
        status: updateBookingDto.status,
        price_per_night: updateBookingDto.pricePerNight,
        total_amount: updateBookingDto.totalAmount,
        updated_at: new Date(Date.now()),
      }
    });
    await this.notificationService.create({
      userId: updateBooking.user_id!,
      bookingId: updateBooking.id,
      type: 'BOOKING_CREATED',
      message: "A booking has been updated",
      isRead: false,
      createdAt: new Date(Date.now())
    });
    return updateBooking;
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} booking`);
    const removeBooking = await this.prisma.booking.delete({ where: { id } });
    await this.notificationService.create({
      userId: removeBooking.user_id!,
      bookingId: removeBooking.id,
      type: 'BOOKING_CANCELLED',
      message: "A booking has been cancel",
      isRead: false,
      createdAt: new Date(Date.now())
    });
    return removeBooking;
  }
}
