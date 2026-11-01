import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

/* Only basic function for now */
@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('NotificationService');

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          // id: createNotificationDto.id,
          user_id: createNotificationDto.userId,
          booking_id: createNotificationDto.bookingId,
          type: createNotificationDto.type,
          message: createNotificationDto.message,
          is_read: createNotificationDto.isRead,
          created_at: createNotificationDto.createdAt,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid notification data provided");
    }
  }

  async findAll() {
    this.logger.log(`This action returns all notification`);
    return await this.prisma.notification.findMany();
  }

  async findOne(id: number) {
    this.logger.log(`This action returns a #${id} notification`);
    return await this.prisma.notification.findUnique({ where: { id } });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    this.logger.log(`This action updates a #${id} notification`);
    return await this.prisma.notification.update({ where: { id }, data: { ...updateNotificationDto } });
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} notification`);
    return await this.prisma.notification.delete({ where: { id } });
  }
}
