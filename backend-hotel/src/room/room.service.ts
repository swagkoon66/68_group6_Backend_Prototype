import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class RoomService {

  /* calls constructor to do prisma service thingy */
  constructor(private readonly prisma: PrismaService) { }
  private readonly logger = new Logger('RoomServive');

  /* create or add new room into the database */
  async create(createRoomDto: CreateRoomDto) {
    this.logger.log(`Creating room ${createRoomDto.id, createRoomDto.name}`);
    try {
      return await this.prisma.room.create({
        data: {
          id: createRoomDto.id,
          name: createRoomDto.name,
          description: createRoomDto.description,
          capacity: createRoomDto.capacity,
          price_per_night: createRoomDto.pricePerNight,
          is_active: createRoomDto.isActive ??  true,
          booking_status: XXX,
          room_images: XXX,
        }
      })
    } catch (e: any) {
      if (typeof e?.message === 'string' && e.message.toLowerCase().includes('uniques')) {
        this.logger.error("Invalid room data provided");
      }
    }
  }

  /* fetch all rooms */
  async findAll() {
    this.logger.log(`Returning all rooms`);
    return this.prisma.room.findMany();
  }

  /* fetch room with = id */
  async findARoom(id: string) {
    this.logger.log(`Returning a #${id} room`);
    const room = await this.prisma.room.findUnique({ where: { id } })

    if (!room) {
      this.logger.warn(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return room;
  }

  /* Lets ignore these one for another week -Koon */
  /*
  async update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  async remove(id: number) {
    return `This action removes a #${id} room`;
  }
  */

  /* enable or disable active room */
  async enable(id: string) {
    this.logger.log(`enabling room id=${id}`);

    const room = await this.findARoom(id);

    if (!room) {
      this.logger.error(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.prisma.room.update({ where: { id }, data: { is_active: true } });
  }
  async disable(id: string) {
    this.logger.log(`disabling room id=${id}`);

    const room = await this.findARoom(id);

    if (!room) {
      this.logger.error(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }

    return this.prisma.room.update({ where: { id }, data: { is_active: false } });
  }
}
