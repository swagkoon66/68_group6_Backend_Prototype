import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { UseGuards } from '@nestjs/common';
import { user_role } from '@prisma/client';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post()
  @Roles(user_role.ADMIN)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findARoom(id);
  }

  /* 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
  */

  @Patch(':id/enable')
  @Roles(user_role.ADMIN)
  enable(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.enable(id);
  }
  @Patch(':id/disnable')
  @Roles(user_role.ADMIN)
  disable(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.disable(id);
  }
}
