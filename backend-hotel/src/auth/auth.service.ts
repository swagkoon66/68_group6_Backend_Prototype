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
      this.refreshTokenService.createLogin(payload.user_id, access_token);
    }
    return access_token;
  }

  async logout(tokenObj: { token: string }) {
    return await this.refreshTokenService.removeThatHashed(tokenObj.token);
  }

  async refresh(currentDto: LoginAuthDto, tokenObj: { token: string }) {
    const currentUser: CreateUserDto = await this.validateUser(currentDto.email, currentDto.password);
    if (currentUser == null) {
      return new UnauthorizedException("User not found");
    }
    const availableToken = await this.refreshTokenService.findAllOfUserToken((await this.userService.findOneByEmail(currentUser.email))!.id);
    if (availableToken == null) {
      return new BadRequestException("Tokens expired");
    }
    return;

  }
}
