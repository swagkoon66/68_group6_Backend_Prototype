import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { };
  private readonly logger = new Logger('UserService');

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user ${createUserDto.name}`);
    try {
      return await this.prisma.user.create({
        data: {
          id: createUserDto.id,
          name: createUserDto.name,
          email: createUserDto.email,
          password_hash: createUserDto.passwordHash,
          role: createUserDto.role,
          is_active: createUserDto.isActive,
          created_at: createUserDto.createdAt,
          updated_at: createUserDto.updatedAt,
          booking: createUserDto.booking ? {
            create: createUserDto.booking.map((a) => ({
              id: a.id,
              user_id: a.userId,
              room_id: a.roomId,
              check_in: a.checkIn,
              check_out: a.checkOut,
              guest: a.guest,
              status: a.status,
              price_per_night: a.pricePerNight,
              total_amount: a.totalAmount,
              created_at: a.createdAt,
              updated_at: a.updatedAt,
            }))
          } : undefined,
          notification: createUserDto.notification ? {
            create: createUserDto.notification.map((b) => ({
              id: b.id,
              user_id: b.id,
              booking_id: b.bookingId,
              type: b.type,
              message: b.message,
              is_read: b.isRead,
              created_at: b.createdAt,
            }))
          } : undefined,
          refresh_token: createUserDto.refreshToken ? {
            create: createUserDto.refreshToken?.map((c) => ({
              id: c.id,
              user_id: c.id,
              token_hash: c.tokenHash,
              expires_at: c.expiresAt,
              revoked_at: c.revokedAt,
            }))
          } : undefined,
        }
      });
    } catch (e: any) {
      this.logger.error("Invalid user data provided");
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
