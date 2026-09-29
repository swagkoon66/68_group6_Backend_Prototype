import { Module } from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { RoomImageController } from './room-image.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RoomImageController],
  providers: [RoomImageService, /* need prismaService to connect */ PrismaService],
})
export class RoomImageModule {}
