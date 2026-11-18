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
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoomModule,
    BookingModule,
    NotificationModule,
    RefreshTokenModule,
    RoomImageModule,
    UserModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          return { ttl: 5000 }; // default in-memory store, no Redis
        }
        // const host = process.env.REDIS_HOST ?? '127.0.0.1';
        // KOON CHANGED FOR DEPLOYING ON RAILWAY (NEEDS PWD) AND LOCALLY
        const redisUrl = process.env.REDIS_URL ?? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
        const redisStore = createKeyv(redisUrl);
        redisStore.on('error', (err) => console.error('Redis error:', err));
        return { stores: [redisStore] };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // NO NEED BECAUSE ERROR
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule { }
