import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';

@Controller('room-image')
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}

  @Post()
  create(@Body() createRoomImageDto: CreateRoomImageDto) {
    return this.roomImageService.create(createRoomImageDto);
  }

  @Get()
  findAll() {
    return this.roomImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomImageDto: UpdateRoomImageDto) {
    return this.roomImageService.update(+id, updateRoomImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomImageService.remove(+id);
  }
}
