import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { user_role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private userService: UserService) { }

  async register(registerDto: RegisterAuthDto) {
    const { email, password, name } = registerDto;
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const saltRounds = Number(process.env.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /* 
    UNCLEAR WHAT SHOULD KOON DO 
    BELOW IS THE ALMOST A COPY FROM LAB
    */
    const user = await this.prisma.user.create({
      data: {
        id: "67", //UNCLEAR
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
    const payload = { name: user.name, email: user.email, id: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload)
    return access_token;
  }

  /* Koon prototype not working yet */
  // async refresh(currentDto: LoginAuthDto, token: string) {
  //   const userID = await this.validateUser(currentDto.email, currentDto.password);
  //   const user = await this.userService.findOne(userID);
  //   if (!user) {
  //     throw new UnauthorizedException(`User Id: ${userID} is not authorized to access`);
  //   }
  //   // ADDED
  //   try {
  //     let temp = await this.jwtService.verifyAsync(token);
  //     return this.login(currentDto);
  //   }
  //   catch (e) {
  //     let today_date = Date.now();
  //     // throw new TokenExpiredError('Token has already expired', new Date(today_date));
  //     console.log(`Token has already expired ${new Date(today_date)}`);
  //   }
  //   // ADDED
  //   // issue new token for expired or something
  //   const payload = { name: user.name, email: user.email, id: user.id, role: user.role };
  //   const new_token = this.jwtService.signAsync(payload);
  //   return new_token;
  // }
}
