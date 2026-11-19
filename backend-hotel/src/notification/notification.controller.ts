
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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@ApiTags('notification')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(user_role.ADMIN)
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a notification (Admin)',
    description: 'Creates a notification for a user associated with a booking.',
  })
  @ApiResponse({ status: 201, description: 'Notification created successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Admin access required.' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all notifications (Admin)',
    description: 'Returns all notifications in the system.',
  })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Admin access required.' })
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a notification by ID (Admin)',
    description: 'Returns the notification matching the specified ID.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Notification retrieved successfully. Returns null if no matching notification exists.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Admin access required.' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a notification (Admin)',
    description: 'Updates the supplied notification fields.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Notification updated successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Admin access required.' })
  @ApiResponse({ status: 404, description: 'Notification does not exist.' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a notification (Admin)',
    description: 'Deletes the notification matching the specified ID.',
  })
  @ApiParam({ name: 'id', description: 'Notification ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Authentication required or invalid token.' })
  @ApiResponse({ status: 403, description: 'Admin access required.' })
  @ApiResponse({ status: 404, description: 'Notification does not exist.' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
