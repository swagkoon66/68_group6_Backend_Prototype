import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { RoomService } from '../room/room.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, RefreshTokenService, RoomService, NotificationService],
})
export class BookingModule {}
