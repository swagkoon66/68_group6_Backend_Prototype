import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { NotificationModule } from './notification/notification.module';
import { RoomImageModule } from './room-image/room-image.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, RoomModule, BookingModule, NotificationModule, RefreshTokenModule, RoomImageModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
