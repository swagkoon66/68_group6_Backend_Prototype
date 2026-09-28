import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, /* need prismaService to connect */ PrismaService],
})
export class RoomModule {}
