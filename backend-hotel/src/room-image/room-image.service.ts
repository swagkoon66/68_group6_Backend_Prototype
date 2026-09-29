import { Injectable } from '@nestjs/common';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class RoomImageService {
  constructor(private readonly prisma: PrismaService) { }
  private readonly logger = new Logger('RoomImageService');

  async create(createRoomImageDto: CreateRoomImageDto) {
    this.logger.log(`Creating roomImage ${createRoomImageDto.url, createRoomImageDto.id, createRoomImageDto.roomId}`);
    try {
      return await this.prisma.room_image.create({
        data: {
          id: createRoomImageDto.id,
          room_id: createRoomImageDto.roomId,
          url: createRoomImageDto.url,
          storage_key: createRoomImageDto.storageKey,
          mime_type: createRoomImageDto.mimeType,
          file_size: createRoomImageDto.fileSize,
          is_primary: createRoomImageDto.isPrimary,
          created_at: createRoomImageDto.createdAt,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid room-image data provided");
    }
  }

  findAll() {
    return `This action returns all roomImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomImage`;
  }

  update(id: number, updateRoomImageDto: UpdateRoomImageDto) {
    return `This action updates a #${id} roomImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomImage`;
  }
}
