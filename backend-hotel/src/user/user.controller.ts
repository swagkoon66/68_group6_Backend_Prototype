import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { user_role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(user_role.USER)
  @Roles(user_role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(user_role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(user_role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(user_role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(user_role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('admin-info')
  fetchAdminInfo() {
    return this.userService.findOne(/*lets say that the first user is an admin*/ 1);
  }
}
