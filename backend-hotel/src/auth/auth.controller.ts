
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new account with the USER role.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email address is already registered.',
  })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Validates user credentials and returns an access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a JWT token.',
    schema: {
      type: 'string',
      example: 'your-jwt-token',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
  })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Revokes the supplied token.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'your-jwt-token',
          description: 'Token to revoke.',
        },
      },
      required: ['token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logout request processed.',
  })
  logout(@Body() tokenObj: { token: string }) {
    return this.authService.logout(tokenObj);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh authentication token',
    description:
      'Validates user credentials and the existing token, then returns a replacement JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    schema: {
      type: 'string',
      example: 'your-new-jwt-token',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials, invalid token, expired token, or revoked token.',
  })
  refresh(@Body() refreshDto: RefreshAuthDto) {
    return this.authService.refresh(refreshDto);
  }
}
