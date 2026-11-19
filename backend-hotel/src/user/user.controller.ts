
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@ApiTags('user')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(user_role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiCreatedResponse({ description: 'User created successfully.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Keep this route before :id to avoid route conflicts.
  @Get('admin-info')
  @ApiOperation({ summary: 'Get the user record currently used for admin info' })
  @ApiOkResponse({ description: 'User information retrieved successfully.' })
  fetchAdminInfo() {
    return this.userService.findOne(1);
  }

  @Roles(user_role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiOkResponse({ description: 'List of users retrieved successfully.' })
  findAll() {
    return this.userService.findAll();
  }

  @Roles(user_role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User found successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(user_role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(user_role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
