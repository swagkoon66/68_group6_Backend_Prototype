import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('BookingService');

  async create(createBookingDto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: {
          // id: createBookingDto.id,
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

  async findOne(id: number) {
    this.logger.log(`This action returns a #${id} booking`);
    return await this.prisma.booking.findUnique({ where: { id } });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    this.logger.log(`This action updates a #${id} booking`);
    return await this.prisma.booking.update({
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
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} booking`);
    return await this.prisma.booking.delete({ where: { id } });
  }
}
