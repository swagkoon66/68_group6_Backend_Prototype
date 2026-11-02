import { Module } from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { RoomImageController } from './room-image.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RoomService } from '../room/room.service';

@Module({
  controllers: [RoomImageController],
  providers: [RoomImageService, PrismaService, RoomService],
})
export class RoomImageModule {}
