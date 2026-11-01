import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() tokenObj: { token: string }) {
    return this.authService.logout(tokenObj);
  }

  @Post('refresh')
  refresh(@Body() loginDto: LoginAuthDto, @Body() tokenObj: { token: string }) {
    try {
      this.authService.refresh(loginDto, tokenObj);
    }
    catch (e) {
      if (e instanceof UnauthorizedException) {
        return this.register;
      }
      else if (e instanceof BadRequestException) {
        return this.login;
      }
    }
  }

}
