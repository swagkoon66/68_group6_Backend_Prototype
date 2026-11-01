import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { user_role } from '@prisma/client';
import { Roles } from '../auth/roles/roles.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) { }

  @Post()
  @Roles(user_role.ADMIN)
  create(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.refreshTokenService.create(createRefreshTokenDto);
  }

  @Get()
  @Roles(user_role.ADMIN)
  findAll() {
    return this.refreshTokenService.findAll();
  }

  @Get(':id')
  @Roles(user_role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.refreshTokenService.findOne(+id);
  }

  @Patch(':id')
  @Roles(user_role.ADMIN)
  update(@Param('id') id: string, @Body() updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  }

  @Delete(':id')
  @Roles(user_role.ADMIN)
  remove(@Param('id') id: string) {
    return this.refreshTokenService.remove(+id);
  }
}
