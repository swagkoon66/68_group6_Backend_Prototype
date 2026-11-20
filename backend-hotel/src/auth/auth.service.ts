import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { user_role } from '@prisma/client';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService, private refreshTokenService: RefreshTokenService) { }

  async register(registerDto: RegisterAuthDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const saltRounds = Number(process.env.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: hashedPassword,
        role: user_role.USER,
        is_active: true,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      }
    })
    return {
      message: 'User registered sucessfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.refreshTokenService.DeleteIfTokensExpired(user.id);
    var availableRefreshTokens = await this.refreshTokenService.findAllOfUserToken(user.id);
    var access_token;
    if (availableRefreshTokens.length != 0) {
      access_token = (await this.refreshTokenService.findOne(availableRefreshTokens[0].id))?.token_hash;
    } else {
      const payload = { name: user.name, email: user.email, user_id: user.id, role: user.role };
      access_token = this.jwtService.sign(payload);
      await this.refreshTokenService.createLogin(payload.user_id, access_token);
    }
    return access_token;
  }

  async logout(tokenObj: { token: string }) {
    return await this.refreshTokenService.removeThatHashed(tokenObj.token);
  }

  
  async refresh(refreshDto: RefreshAuthDto) {
      const { email, password, token } = refreshDto;

      const currentUser = await this.validateUser(email, password);

      if (!currentUser) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const storedToken =
        await this.refreshTokenService.findOneFromToken(token);

      if (!storedToken || storedToken.user_id !== currentUser.id) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.expires_at <= new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      if (storedToken.revoked_at !== null) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const payload = {
        name: currentUser.name,
        email: currentUser.email,
        user_id: currentUser.id,
        role: currentUser.role,
      };

      const newToken = this.jwtService.sign(payload);

      await this.refreshTokenService.update(storedToken.id, {
          tokenHash: newToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      return newToken;
    
    }

}
