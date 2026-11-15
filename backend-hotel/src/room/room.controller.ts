import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { user_role } from '@prisma/client';
import { Public, Roles } from '../auth/roles/roles.decorator';
import { SearchRoomParamDto } from './dto/search-room-param.dto';

@ApiTags('room')
@ApiBearerAuth('access-token')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Term created successfully', type: CreateRoomDto }) // Returns the created object, conceptually matches DTO structure usually
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }


  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms', type: [CreateRoomDto] }) // Returns an array of room objects
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiParam({ name: 'id', description: 'ID of the room to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'Room details', type: CreateRoomDto }) // Returns the room object
  findOne(@Param('id') id: number) {
    return this.roomService.findARoom(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Update a room' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({ status: 200, description: 'Term updated successfully', type: CreateRoomDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Term not found' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({ status: 200, description: 'Room deleted successfully', type: CreateRoomDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Term not found' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @Patch(':id/enable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Enable a room' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({ status: 200, description: 'Room enabled successfully', type: CreateRoomDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Term not found' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  enable(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.enable(id);
  }
  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Disable a room' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  @ApiResponse({ status: 200, description: 'Room disabled successfully', type: CreateRoomDto }) 
  disable(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.disable(id);
  }

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Search for rooms based on parameters' })
  @ApiResponse({ status: 200, description: 'List of rooms matching search criteria', type: [CreateRoomDto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  search(@Body() seachParamDto: SearchRoomParamDto){
    return this.roomService.findAllRoomThat(seachParamDto);
  }
}
