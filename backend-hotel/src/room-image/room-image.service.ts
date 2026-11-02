import { Injectable } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { RoomService } from '../room/room.service';

@Injectable()
export class RoomImageService {
  constructor(private readonly prisma: PrismaService, private roomService: RoomService) { }
  private readonly logger = new Logger('RoomImageService');

  async create(createRoomImageDto: CreateRoomImageDto) {
    this.logger.log(`Creating roomImage ${createRoomImageDto.url} for room ${createRoomImageDto.roomId}`);
    try {
      const roomImage = await this.prisma.room_image.create({
        data: {
          room_id: createRoomImageDto.roomId,
          url: createRoomImageDto.url,
          storage_key: createRoomImageDto.storageKey,
          mime_type: createRoomImageDto.mimeType,
          file_size: createRoomImageDto.fileSize,
          is_primary: createRoomImageDto.isPrimary,
          created_at: createRoomImageDto.createdAt ?? new Date(Date.now())
        }
      });
      if (roomImage.room_id == null) {
        throw new Error("Invalid Room ID");
      }
      await this.roomService.updateImage(roomImage.room_id, roomImage);
      return roomImage;
    } catch (e: any) {
      this.logger.error("Invalid room-image data provided");
    }
  }

  async findAll() {
    this.logger.log(`This action returns all roomImage`);
    return await this.prisma.room_image.findMany();
  }

  async findOne(id: number) {
    this.logger.log(`This action returns a #${id} roomImage`);
    return await this.prisma.room_image.findUnique({ where: { id } });
  }

  async update(id: number, updateRoomImageDto: UpdateRoomImageDto) {
    this.logger.log(`This action updates a #${id} roomImage`);
    return await this.prisma.room_image.update({ where: { id }, data: { ...updateRoomImageDto } });
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} roomImage`);
    return await this.prisma.room_image.delete({ where: { id } });
  }
}
