
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
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { RefreshTokenService } from './refresh-token.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { user_role } from '@prisma/client';
import { Roles } from '../auth/roles/roles.decorator';

@ApiTags('refresh-token')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('refresh-token')
export class RefreshTokenController {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post()
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Create a refresh token record (Admin only)' })
  @ApiCreatedResponse({ description: 'Refresh token record created.' })
  create(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.refreshTokenService.create(createRefreshTokenDto);
  }

  @Get()
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Get all refresh token records (Admin only)' })
  @ApiOkResponse({ description: 'Refresh token records retrieved.' })
  findAll() {
    return this.refreshTokenService.findAll();
  }

  @Get(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Get a refresh token record by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Refresh token record ID' })
  @ApiOkResponse({ description: 'Refresh token record retrieved.' })
  @ApiNotFoundResponse({ description: 'Refresh token record not found.' })
  findOne(@Param('id') id: string) {
    return this.refreshTokenService.findOne(+id);
  }

  @Patch(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Update a refresh token record (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Refresh token record ID' })
  @ApiOkResponse({ description: 'Refresh token record updated.' })
  @ApiNotFoundResponse({ description: 'Refresh token record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  ) {
    return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  }

  @Delete(':id')
  @Roles(user_role.ADMIN)
  @ApiOperation({ summary: 'Delete a refresh token record (Admin only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Refresh token record ID' })
  @ApiOkResponse({ description: 'Refresh token record deleted.' })
  @ApiNotFoundResponse({ description: 'Refresh token record not found.' })
  remove(@Param('id') id: string) {
    return this.refreshTokenService.remove(+id);
  }
}
