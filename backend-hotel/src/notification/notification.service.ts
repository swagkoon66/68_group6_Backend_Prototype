import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('NotificationService');

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      return await this.prisma.notification.create({
        data: {
          id: createNotificationDto.id,
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

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
