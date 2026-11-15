
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Hotel API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  // Normal authentication test account
  const testEmail = `e2e-registration-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'E2E Test User';

  // Admin test account
  const adminTestEmail = `e2e-admin-${Date.now()}@example.com`;
  const adminTestPassword = 'AdminPassword123!';
  const adminTestName = 'E2E Admin User';

  // Normal USER account
  const roomUserEmail = `e2e-room-user-${Date.now()}@example.com`;
  const roomUserPassword = 'RoomUserPassword123!';
  const roomUserName = 'E2E Room User';

  let adminToken = '';
  let bookingUserToken = '';

  const createdRoomIds: number[] = [];
  const createdBookingIds: number[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up only accounts belonging to this test suite.
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminTestEmail, roomUserEmail, testEmail],
        },
      },
    });

    // Register Admin account.
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: adminTestName,
        email: adminTestEmail,
        password: adminTestPassword,
      })
      .expect(201);

    // Promote only this test account to ADMIN.
    await prisma.user.update({
      where: { email: adminTestEmail },
      data: { role: 'ADMIN' },
    });

    // Login as Admin.
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminTestEmail,
        password: adminTestPassword,
      })
      .expect(200);

    adminToken = adminLogin.text;

    // Register a separate normal USER account.
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: roomUserName,
        email: roomUserEmail,
        password: roomUserPassword,
      })
      .expect(201);
  });

  afterAll(async () => {
    // Delete notifications associated with test bookings first.
    if (createdBookingIds.length > 0) {
      await prisma.notification.deleteMany({
        where: {
          booking_id: { in: createdBookingIds },
        },
      });

      // Delete only bookings created by this test suite.
      await prisma.booking.deleteMany({
        where: {
          id: { in: createdBookingIds },
        },
      });
    }

    // Delete only rooms created by this test suite.
    if (createdRoomIds.length > 0) {
      await prisma.room.deleteMany({
        where: {
          id: { in: createdRoomIds },
        },
      });
    }

    // Delete only dedicated test accounts.
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminTestEmail, roomUserEmail, testEmail],
        },
      },
    });

    await app.close();
  });

  // -----------------------------------------
  // GET /
  // -----------------------------------------

  describe('GET /', () => {
    it('should return the application status message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect(
          'Hello World! The backend project is up and running',
        );
    });
  });

  // -----------------------------------------
  // ROOM API
  // -----------------------------------------

  describe('Room API - access control', () => {
    it('should allow public access to GET /room', async () => {
      const response = await request(app.getHttpServer())
        .get('/room')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject room creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/room')
        .send({
          name: 'E2E Unauthorized Room',
          description: 'Testing unauthorized access',
          capacity: 2,
          pricePerNight: 1500,
        })
        .expect(401);
    });

    it('should allow an Admin to create a room', async () => {
      const roomData = {
        name: `E2E Admin Room ${Date.now()}`,
        description: 'Room created by Admin E2E test',
        capacity: 2,
        pricePerNight: 1500,
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/room')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(roomData)
        .expect(201);

      expect(response.body).toMatchObject({
        name: roomData.name,
        capacity: roomData.capacity,
        is_active: true,
      });

      expect(response.body.id).toBeDefined();

      // Track the room for cleanup.
      createdRoomIds.push(response.body.id);

      // Verify the room was saved in the database.
      const savedRoom = await prisma.room.findUnique({
        where: { id: response.body.id },
      });

      expect(savedRoom).not.toBeNull();
      expect(savedRoom?.name).toBe(roomData.name);
      expect(savedRoom?.capacity).toBe(roomData.capacity);
    });

    it('should reject room creation by a normal USER', async () => {
      const userLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: roomUserEmail,
          password: roomUserPassword,
        })
        .expect(200);

      const userToken = userLogin.text;

      await request(app.getHttpServer())
        .post('/room')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: `E2E User Unauthorized Room ${Date.now()}`,
          description: 'Should not be created',
          capacity: 2,
          pricePerNight: 1500,
          isActive: true,
        })
        .expect(403);
    });
  });

  // -----------------------------------------
  // BOOKING API
  // -----------------------------------------

  describe('Booking API - lifecycle', () => {
    let bookingRoomId: number;
    let bookingId: number;

    const checkIn = '2027-01-10T00:00:00.000Z';
    const checkOut = '2027-01-15T00:00:00.000Z';

    beforeAll(async () => {
      // Login as the normal USER.
      const userLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: roomUserEmail,
          password: roomUserPassword,
        })
        .expect(200);

      bookingUserToken = userLogin.text;

      // Create a dedicated room for booking tests.
      const roomResponse = await request(app.getHttpServer())
        .post('/room')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `E2E Booking Room ${Date.now()}`,
          description: 'Room for booking lifecycle tests',
          capacity: 2,
          pricePerNight: 1500,
          isActive: true,
        })
        .expect(201);

      bookingRoomId = roomResponse.body.id;
      createdRoomIds.push(bookingRoomId);
    });

    it('should allow a USER to create a booking successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${bookingUserToken}`)
        .send({
          roomId: bookingRoomId,
          checkIn,
          checkOut,
          guest: 2,
        })
        .expect(201);

      // Track the booking immediately for cleanup.
      bookingId = response.body.id;

      expect(bookingId).toBeDefined();
      createdBookingIds.push(bookingId);

      expect(response.body).toMatchObject({
        room_id: bookingRoomId,
        guest: 2,
        status: 'PENDING',
        price_per_night: '1500',
        total_amount: '7500',
      });

      expect(response.body.user_id).toBeDefined();

      // Verify the booking was saved in the database.
      const savedBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(savedBooking).not.toBeNull();
      expect(savedBooking?.room_id).toBe(bookingRoomId);
      expect(savedBooking?.guest).toBe(2);
      expect(savedBooking?.status).toBe('PENDING');
      expect(savedBooking?.user_id).toBeDefined();
      expect(Number(savedBooking?.total_amount)).toBe(7500);
    });

    it('should reject a booking when the room is already booked for overlapping dates', async () => {
      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${bookingUserToken}`)
        .send({
          roomId: bookingRoomId,
          checkIn,
          checkOut,
          guest: 1,
        })
        .expect(400);

      // Confirm the original booking still exists.
      const existingBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(existingBooking).not.toBeNull();
      expect(existingBooking?.status).toBe('PENDING');
    });

    it('should allow an Admin to cancel a booking by updating its status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/booking/${bookingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CANCELLED',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        id: bookingId,
        status: 'CANCELLED',
      });

      // Verify the cancelled status in the database.
      const cancelledBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(cancelledBooking).not.toBeNull();
      expect(cancelledBooking?.status).toBe('CANCELLED');

      // Verify the update notification was created.
      const notifications = await prisma.notification.findMany({
        where: {
          booking_id: bookingId,
        },
      });

      expect(notifications.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------
  // POST /auth/register
  // -----------------------------------------

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: testName,
          email: testEmail,
          password: testPassword,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'User registered sucessfully',
        user: {
          email: testEmail,
          name: testName,
          role: 'USER',
        },
      });

      expect(response.body.user).not.toHaveProperty(
        'password_hash',
      );

      // Verify the actual database record.
      const savedUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(savedUser).not.toBeNull();
      expect(savedUser?.password_hash).not.toBe(testPassword);
      expect(savedUser?.password_hash).toMatch(/^\$2[aby]\$/);
    });

    it('should reject duplicate email registration', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: testName,
          email: testEmail,
          password: testPassword,
        })
        .expect(409);
    });

    it('should reject registration when name is missing', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `missing-name-${Date.now()}@example.com`,
          password: testPassword,
        })
        .expect(400);
    });

    it('should reject registration with an invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: testName,
          email: 'not-an-email',
          password: testPassword,
        })
        .expect(400);
    });
  });

  // -----------------------------------------
  // POST /auth/login and logout
  // -----------------------------------------

  describe('POST /auth/login', () => {
    let loginToken: string;

    it('should login successfully and return a JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(0);

      loginToken = response.text;

      // Verify the refresh-token record was saved.
      const savedUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(savedUser).not.toBeNull();

      const savedTokens = await prisma.refresh_token.findMany({
        where: { user_id: savedUser!.id },
      });

      expect(savedTokens.length).toBeGreaterThan(0);
      expect(savedTokens[0].token_hash).toBe(loginToken);
      expect(savedTokens[0].revoked_at).toBeNull();
      expect(savedTokens[0].expires_at.getTime()).toBeGreaterThan(
        Date.now(),
      );
    });

    it('should reuse the existing token on another login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.text).toBe(loginToken);
    });

    it('should reject login with an incorrect password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should reject login with an unknown email', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'unknown-user@example.com',
          password: testPassword,
        })
        .expect(401);
    });

    it('should logout successfully and remove the refresh token from the database', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      const token = loginResponse.text;

      const tokenBeforeLogout =
        await prisma.refresh_token.findUnique({
          where: { token_hash: token },
        });

      expect(tokenBeforeLogout).not.toBeNull();

      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ token })
        .expect(200);

      const tokenAfterLogout =
        await prisma.refresh_token.findUnique({
          where: { token_hash: token },
        });

      expect(tokenAfterLogout).toBeNull();
    });
  });

  // -----------------------------------------
  // POST /auth/refresh
  // -----------------------------------------

  describe('POST /auth/refresh', () => {
    it('should refresh the token and replace the old token in the database', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      const oldToken = loginResponse.text;

      // Wait so the newly signed JWT has a different issued-at time.
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          email: testEmail,
          password: testPassword,
          token: oldToken,
        })
        .expect(200);

      const newToken = refreshResponse.text;

      expect(typeof newToken).toBe('string');
      expect(newToken.length).toBeGreaterThan(0);
      expect(newToken).not.toBe(oldToken);

      // Verify the old token was replaced.
      const oldTokenRecord =
        await prisma.refresh_token.findUnique({
          where: { token_hash: oldToken },
        });

      expect(oldTokenRecord).toBeNull();

      // Verify the new token exists.
      const newTokenRecord =
        await prisma.refresh_token.findUnique({
          where: { token_hash: newToken },
        });

      expect(newTokenRecord).not.toBeNull();

      const savedUser = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(newTokenRecord?.user_id).toBe(savedUser?.id);

      expect(newTokenRecord?.expires_at.getTime()).toBeGreaterThan(
        Date.now(),
      );
    });
  });
});
