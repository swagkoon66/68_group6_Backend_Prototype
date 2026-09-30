import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto){
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto){
    return this.authService.login(loginDto);
  }

  // @Post('refresh')
  // async refresh(@Body() loginDto: LoginAuthDto, token: string){
  //   return this.authService.refresh(loginDto, token);
  // }

  // @Get('admin-info')
  // @users_role('ADMIN')
  // getAdminInfo() {
  //   return this.authService.
  // }
}
