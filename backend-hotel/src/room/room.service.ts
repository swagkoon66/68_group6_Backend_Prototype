import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { SearchRoomParamDto } from './dto/search-room-param.dto';
import { RoomImage } from '../room-image/entities/room-image.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) { }
  private readonly logger = new Logger('RoomServive');

  async create(createRoomDto: CreateRoomDto) {
    this.logger.log(`Creating room ${createRoomDto.name}`);
    try {
      return await this.prisma.room.create({
        data: {
          name: createRoomDto.name,
          description: createRoomDto.description,
          capacity: createRoomDto.capacity,
          price_per_night: createRoomDto.pricePerNight,
          is_active: createRoomDto.isActive ?? true,
          booking: createRoomDto.booking ? {
            create: createRoomDto.booking.map((a) => ({
              user_id: a.userId,
              room_id: a.roomId,
              check_in: a.checkIn,
              check_out: a.checkOut,
              guest: a.guest,
              status: a.status,
              price_per_night: a.pricePerNight,
              total_amount: a.totalAmount,
              created_at: a.createdAt,
              updated_at: a.updatedAt,
            }))
          } : undefined,
          room_image: createRoomDto.roomImage ? {
            create: createRoomDto.roomImage.map((b) => ({
              roomId: b.roomId,
              url: b.url,
              storage_key: b.storageKey,
              mime_type: b.mimeType,
              file_size: b.fileSize,
              is_primary: b.isPrimary,
            }))
          } : undefined,
        }
      })
    } catch (e: any) {
      this.logger.error("Invalid room data provided");
    }
  }

  async findAll() {
    this.logger.log(`Returning all rooms`);
    return this.prisma.room.findMany();
  }

  async findARoom(id: number) {
    this.logger.log(`Returning a #${id} room`);
    const room = await this.prisma.room.findUnique({ where: { id } })

    if (!room) {
      this.logger.warn(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }

  async findAllRoomThat(searchParamDto: SearchRoomParamDto) {
    this.logger.log(`Returning a all room that fits the given search criteria`);
    const { name, capacity, pricePerNight, isActive, startDate, endDate } = searchParamDto;
    const queryWhereString: Prisma.roomWhereInput = {
      ...(name !== undefined && { name: { contains: name } }),
      ...(capacity !== undefined && { capacity }),
      ...(pricePerNight !== undefined && { pricePerNight }),
      ...(isActive !== undefined && { isActive }),
      ...(startDate),
      ...(endDate)
    };
    const room = await this.prisma.room.findMany({ where: queryWhereString });

    if (!room) {
      this.logger.warn(`Room with those criteria are not available`);
      throw new NotFoundException(`Room with those criteria are not available`);
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    this.logger.log(`This action updates a #${id} room`);
    return await this.prisma.room.update({
      where: { id },
      data: {
        name: updateRoomDto.name,
        description: updateRoomDto.description,
        capacity: updateRoomDto.capacity,
        is_active: updateRoomDto.isActive,
        updated_at: new Date(Date.now())
      }
    });
  }

  async updateImage(id: number, image: RoomImage) {
    this.logger.log(`This action updates image of #${id} room`);
    return await this.prisma.room.update({
      where: { id },
      data: {
        room_image: {
          ...image
        },
        updated_at: new Date(Date.now())
      }
    });
  }

  async remove(id: number) {
    this.logger.log(`This action removes a #${id} room`);
    return await this.prisma.room.delete({ where: { id } });
  }

  async enable(id: number) {
    this.logger.log(`enabling room id=${id}`);

    const room = await this.findARoom(id);

    if (!room) {
      this.logger.error(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.prisma.room.update({ where: { id }, data: { is_active: true } });
  }
  async disable(id: number) {
    this.logger.log(`disabling room id=${id}`);

    const room = await this.findARoom(id);

    if (!room) {
      this.logger.error(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.prisma.room.update({ where: { id }, data: { is_active: false } });
  }
}
