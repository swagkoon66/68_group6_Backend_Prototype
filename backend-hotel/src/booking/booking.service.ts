import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

/* Only basic function for now */
@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('BookingService');

  async create(createBookingDto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: {
          id: createBookingDto.id,
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
              id: createBookingDto.notification.id,
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

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
