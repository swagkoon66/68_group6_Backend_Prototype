## 1. End-to-End (E2E) Testing

### 1.1 Overview

The project uses Jest and Supertest to perform end-to-end testing of the Hotel Management System API.

E2E tests send HTTP requests to the NestJS application and verify:
- HTTP status codes
- Response data
- Authentication and authorization
- Database operations
- Booking lifecycle behavior
- Token management

The test file is:

```text
test/app.e2e-spec.ts
```

### 1.2 Test Environment Preparation

Before running the tests:

1. Install project dependencies.

```bash
npm install
```

2. Create a separate test database, for example `hotel_test`.

3. Create `.env.test` in the project root. Configure the test database connection and the other environment variables required by the application.

Example:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/hotel_test"
SALT_ROUND=10
JWT_SECRET="your-test-jwt-secret"
PORT=3000
NODE_ENV=test
```

Include Redis settings if required by your application configuration.

4. Make sure the test database schema is synchronized with the Prisma schema.

```bash
npx prisma db push
npx prisma generate
```

**Important:** Do not use a production database for E2E testing.

### 1.3 Running E2E Tests

Run the complete E2E test suite:

```bash
npm run test:e2e -- --runInBand
```

Alternatively:

```bash
npx jest --config ./test/jest-e2e.json --runInBand
```

The test suite automatically:
- Starts the NestJS application.
- Applies the global ValidationPipe.
- Creates a dedicated ADMIN account and a normal USER account.
- Promotes the dedicated admin account to ADMIN through Prisma.
- Obtains JWT access tokens for authenticated requests.
- Creates test rooms and bookings when required.
- Removes the test accounts and resources created by the suite after completion.

The test accounts use dynamically generated email addresses, so the reader does not need to create them manually.

### 1.4 E2E Test Cases

#### A. Application API

**E2E-01: Get application status**

- Method: `GET`
- Endpoint: `/`
- Authentication: Not required

Input:

No request body or parameters.

Expected result:
- Status: `200 OK`
- Response:

```text
Hello World! The backend project is up and running
```

#### B. Room API — Access Control

**E2E-02: Retrieve all rooms without authentication**

- Method: `GET`
- Endpoint: `/room`
- Authentication: Not required

Input:

No request body or parameters.

Expected result:
- Status: `200 OK`
- Response: An array containing room records.

**E2E-03: Reject room creation without authentication**

- Method: `POST`
- Endpoint: `/room`
- Authentication: Not provided

Request body:

```json
{
  "name": "E2E Unauthorized Room",
  "description": "Testing unauthorized access",
  "capacity": 2,
  "pricePerNight": 1500
}
```

Expected result:
- Status: `401 Unauthorized`
- The room must not be created.

**E2E-04: Allow ADMIN to create a room**

- Method: `POST`
- Endpoint: `/room`
- Authentication: ADMIN Bearer token

Request body:

```json
{
  "name": "E2E Admin Room",
  "description": "Room created by Admin E2E test",
  "capacity": 2,
  "pricePerNight": 1500,
  "isActive": true
}
```

Expected result:
- Status: `201 Created`
- Response contains a generated room ID.
- Response contains the submitted room name and capacity.
- `is_active` is `true`.
- The room is saved in the database.

**E2E-05: Reject room creation by a normal USER**

- Method: `POST`
- Endpoint: `/room`
- Authentication: USER Bearer token

Request body:

```json
{
  "name": "E2E User Unauthorized Room",
  "description": "Should not be created",
  "capacity": 2,
  "pricePerNight": 1500,
  "isActive": true
}
```

Expected result:
- Status: `403 Forbidden`
- The normal USER must not be allowed to create a room.

#### C. Booking API — Lifecycle

The booking tests use a dedicated room with:
- Capacity: 2 guests
- Price per night: 1500
- Check-in: January 10, 2027
- Check-out: January 15, 2027

The room and USER account are prepared automatically by the E2E test setup.

**E2E-06: Allow a USER to create a booking successfully**

- Method: `POST`
- Endpoint: `/booking`
- Authentication: USER Bearer token

Request body:

```json
{
  "roomId": "<BOOKING_ROOM_ID>",
  "checkIn": "2027-01-10T00:00:00.000Z",
  "checkOut": "2027-01-15T00:00:00.000Z",
  "guest": 2
}
```

Replace `<BOOKING_ROOM_ID>` with the ID of the dedicated booking test room.

Expected result:
- Status: `201 Created`
- Response contains a booking ID.
- `room_id` matches the selected room.
- `guest` is `2`.
- `status` is `PENDING`.
- `price_per_night` is `"1500"`.
- `total_amount` is `"7500"`.
- The booking is saved in the database.

Calculation:

```text
5 nights × 1500 = 7500
```

**E2E-07: Reject a booking with overlapping dates**

- Method: `POST`
- Endpoint: `/booking`
- Authentication: USER Bearer token

Request body:

```json
{
  "roomId": "<BOOKING_ROOM_ID>",
  "checkIn": "2027-01-10T00:00:00.000Z",
  "checkOut": "2027-01-15T00:00:00.000Z",
  "guest": 1
}
```

Use the same room and dates as E2E-06.

Expected result:
- Status: `400 Bad Request`
- The overlapping booking must be rejected.
- The original booking must remain in `PENDING` status.

**E2E-08: Allow ADMIN to cancel a booking**

- Method: `PATCH`
- Endpoint: `/booking/<BOOKING_ID>`
- Authentication: ADMIN Bearer token

Request body:

```json
{
  "status": "CANCELLED"
}
```

Replace `<BOOKING_ID>` with the booking ID generated in E2E-06.

Expected result:
- Status: `200 OK`
- Response contains the booking ID.
- Booking status becomes `CANCELLED`.
- The updated status is saved in the database.
- A notification associated with the booking is created.

#### D. Authentication API — Registration

The registration tests use a dynamically generated email address and a dedicated test account.

**E2E-09: Register a new USER successfully**

- Method: `POST`
- Endpoint: `/auth/register`
- Authentication: Not required

Request body:

```json
{
  "name": "E2E Test User",
  "email": "<UNIQUE_TEST_EMAIL>",
  "password": "TestPassword123!"
}
```

Use a new email address, for example `e2e-registration-example@example.com`.

Expected result:
- Status: `201 Created`
- Response message: `User registered sucessfully`
- Returned user contains the email, name, and role `USER`.
- Response does not expose `password_hash`.
- Password is stored as a bcrypt hash rather than plaintext.

**E2E-10: Reject registration with a duplicate email**

- Method: `POST`
- Endpoint: `/auth/register`
- Authentication: Not required

Request body:

```json
{
  "name": "E2E Test User",
  "email": "<EXISTING_TEST_EMAIL>",
  "password": "TestPassword123!"
}
```

Use the same email registered in E2E-09.

Expected result:
- Status: `409 Conflict`
- Duplicate registration is rejected.

**E2E-11: Reject registration when the name is missing**

- Method: `POST`
- Endpoint: `/auth/register`
- Authentication: Not required

Request body:

```json
{
  "email": "missing-name@example.com",
  "password": "TestPassword123!"
}
```

Expected result:
- Status: `400 Bad Request`
- Registration is rejected because the name is missing.

**E2E-12: Reject registration with an invalid email**

- Method: `POST`
- Endpoint: `/auth/register`
- Authentication: Not required

Request body:

```json
{
  "name": "E2E Test User",
  "email": "not-an-email",
  "password": "TestPassword123!"
}
```

Expected result:
- Status: `400 Bad Request`
- Registration is rejected because the email format is invalid.

#### E. Authentication API — Login and Logout

The following tests use the account registered in E2E-09.

Credentials:

```text
Email: <UNIQUE_TEST_EMAIL>
Password: TestPassword123!
```

**E2E-13: Login successfully and return a JWT**

- Method: `POST`
- Endpoint: `/auth/login`
- Authentication: Not required

Request body:

```json
{
  "email": "<UNIQUE_TEST_EMAIL>",
  "password": "TestPassword123!"
}
```

Expected result:
- Status: `200 OK`
- Response contains a non-empty JWT token as plain text.
- A refresh-token record is saved in the database.
- The token record has no revocation date.
- The expiration date is in the future.

**E2E-14: Reuse the existing token on another login**

- Method: `POST`
- Endpoint: `/auth/login`
- Authentication: Not required

Request body:

```json
{
  "email": "<UNIQUE_TEST_EMAIL>",
  "password": "TestPassword123!"
}
```

Expected result:
- Status: `200 OK`
- The returned token is identical to the previously issued token.

**E2E-15: Reject login with an incorrect password**

- Method: `POST`
- Endpoint: `/auth/login`
- Authentication: Not required

Request body:

```json
{
  "email": "<UNIQUE_TEST_EMAIL>",
  "password": "WrongPassword123!"
}
```

Expected result:
- Status: `401 Unauthorized`
- Login is rejected.

**E2E-16: Reject login with an unknown email**

- Method: `POST`
- Endpoint: `/auth/login`
- Authentication: Not required

Request body:

```json
{
  "email": "unknown-user@example.com",
  "password": "TestPassword123!"
}
```

Expected result:
- Status: `401 Unauthorized`
- Login is rejected.

**E2E-17: Logout successfully and remove the refresh token**

- Method: `POST`
- Endpoint: `/auth/logout`
- Authentication: Not required by the tested request

First, obtain a valid token by logging in.

Request body:

```json
{
  "token": "<VALID_JWT_TOKEN>"
}
```

Replace `<VALID_JWT_TOKEN>` with the token returned by `/auth/login`.

Expected result:
- Status: `200 OK`
- The corresponding refresh-token record is removed from the database.

#### F. Authentication API — Token Refresh

**E2E-18: Refresh a token and replace the old token**

- Method: `POST`
- Endpoint: `/auth/refresh`
- Authentication: Not required by the tested request

First, log in to obtain an existing JWT.

Request body:

```json
{
  "email": "<UNIQUE_TEST_EMAIL>",
  "password": "TestPassword123!",
  "token": "<OLD_JWT_TOKEN>"
}
```

Replace `<OLD_JWT_TOKEN>` with the JWT returned by the login endpoint.

Expected result:
- Status: `200 OK`
- Response contains a new, non-empty JWT.
- The new token differs from the old token.
- The old token record is removed from the database.
- The new token record exists in the database.
- The new token belongs to the same user.
- The new token has a future expiration date.

The automated test waits approximately 1.1 seconds before refreshing to ensure that the newly issued token differs from the old one.

### 1.5 Important Notes About Test Dependencies

The E2E test cases share accounts, tokens, room IDs, and booking IDs.

For example:
- E2E-10 depends on the account created in E2E-09.
- E2E-13 through E2E-17 use the account registered in E2E-09.
- E2E-07 and E2E-08 depend on the booking created in E2E-06.
- E2E-18 uses the account created in E2E-09.

Therefore, run the complete E2E suite to reproduce the verified results. Running an individual test with Jest's `-t` option may fail when its prerequisite test has been skipped.

### 1.6 Latest Verified E2E Results

| Result | Count |
|---|---:|
| Test Suites Passed | 1 |
| Tests Passed | 18 |
| Tests Failed | 0 |

All 18 E2E test cases passed in the latest verification run.