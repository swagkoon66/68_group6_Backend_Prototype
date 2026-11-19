import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { user_role } from '@prisma/client';

import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SearchRoomParamDto } from './dto/search-room-param.dto';
import { RoomResponseDto } from './dto/room-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Public, Roles } from '../auth/roles/roles.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new room (Admin only)' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid room data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) //30 second
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 200,
    description: 'List of rooms',
    type: [RoomResponseDto],
  })
  findAll() {
    return this.roomService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000) //30s econd
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Room details',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id') id: number) {
    return this.roomService.findARoom(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiBody({ type: UpdateRoomDto })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Room deleted successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @Patch(':id/enable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Enable a room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Room enabled successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  enable(@Param('id') id: number) {
    return this.roomService.enable(id);
  }

  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(user_role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Disable a room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Room disabled successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  disable(@Param('id') id: number) {
    return this.roomService.disable(id);
  }

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Search rooms using optional criteria' })
  @ApiBody({ type: SearchRoomParamDto })
  @ApiResponse({
    status: 200,
    description: 'Matching rooms. An empty array means no rooms matched.',
    type: [RoomResponseDto],
  })
  search(@Body() searchParamDto: SearchRoomParamDto) {
    return this.roomService.findAllRoomThat(searchParamDto);
  }
}
