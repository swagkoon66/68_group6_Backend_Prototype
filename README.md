# **Hotel Management Backend System**

## **Introduction**

This is a RESTful backend API for a Hotel Management System, developed using **NestJS**, **TypeScript**, **Prisma ORM**, and **MySQL/MariaDB**. \
The backend provides authentication, room management, booking management, user management, notifications, refresh-token management, and room-image management.

## **1. Technology Stack**

- **Backend Framework:** NestJS
- **Programming Language:** TypeScript
- **Database:** MySQL with MariaDB adapter
- **ORM:** Prisma
- **Authentication:** JWT and Passport
- **Validation:** class-validator and class-transformer
- **API Documentation:** Swagger
- **Testing:** Jest and Supertest
- **Deployment:** Docker and Railway

<hr>

## **2. Project Setup**

This project can be opened 
1. "locally" (```npm run ...```) 
2. by using Docker (```docker compose ...```)
3. on our <a href="68groupxbackend-railway-production.up.railway.app">Railway </a>

### 2.1 "Locally Run" and "Docker" Prerequisites

Before running the project locally, please install the following on your machine:

- <a href="https://nodejs.org/en/download">Node.js</a> (26.13.1) which already has npm (12.2.1 or above): running our NestJS server
- <a href="https://dev.mysql.com/downloads/mysql/8.0.html">MySQL workbench and server</a> (both 8.0): local database which contains our initial sql samples.
- <a href="https://git-scm.com/install/windows">Git</a> (newest) for cloning our <a href="https://github.com/MUICT-Class/691-itcs258-691-itcs258-project-group-1.git">repository</a>.
- <a href="https://docs.docker.com/desktop/setup/install/windows-install/">Docker</a> (newest) which run our little Redis caching and the compose container.
- <a href="https://www.postman.com/downloads/">Postman</a> use for testing our endpoints

### 2.2 Install dependencies

Clone or download the project to your desired directory, open a terminal in the project directory
```bash
git clone https://github.com/MUICT-Class/691-itcs258-691-itcs258-project-group-1.git
```
and run:
```bash
cd /backend-hotel
npm install
```

***might take around 2 to 5 minutes to install***

### 2.3 Environment File Configuration

Create a `.env` file in the ```/backend-hotel``` directory by
```bash
copy .env.example .env
```

Configure the following environment variables with your credentials:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"
SALT_ROUND=12
JWT_SECRET="YOUR_SECRET_KEY"
```

### 2.4 Database setup

Make sure the MySql database server is running and the database url configured in `DATABASE_URL` exists.

#### 2.4.1 Synchronize from the repository's Prisma schema to the database:

```bash
npx prisma db push
```

If Prisma Client needs to be regenerated:

```bash
npx prisma generate
```

Run our MySql script in the MySql workbench:

```bash
this file --> SampleData.sql
```

#### 2.4.2 Pull running database up onto the Prisma
Run our MySql scripts in the MySql workbench:

```bash
this file --> SampleData.sql
this file --> SampleSchema.sql
```

Pull those data from the MySql:

```bash
npx prisma db pull
```

Generate Prisma client:

```bash
npx prisma generate
```

<hr>

### 2.5 Deploy the Redis caching on Docker

In this case, you need to open your Docker on the background then open your terminal to change to our NestJS server directory:

```bash
cd /backend
```

Then run this docker compose file:

```docker
docker compose -f compose.redis.local.yml -d --build --wait
```

And wait for the Redis service to run.
	
## **3. Running the Application**

### 3.1 Running locally

### Development mode

```bash
npm run start:dev
```

### Standard mode

```bash
npm run start
```

### Compile out production mode

```bash
npm run build
npm run start:prod
```

The default APP address is on:

```text
http://localhost:3000
```


### 3.2 Deploying on Docker locally

Copy our docker.env file and set your credentials: \
(Our design choice to separate .env (nestJS) and docker.env (Docker))

```bash
copy docker.example.env docker.env
```

Composing up "local" version:

```docker
docker compose --env-file docker.env -f compose.yml -f compose.local.yml up -d --build --wait
```

Composing up "Production" version:

```docker
docker compose --env-file docker.env -f compose.yml -f compose.production.yml -f compose.publish.yml up -d --build --wait
```

The default app's container address is on:

```text
http://localhost:8084
```

<hr>

## **4. Swagger API Documentation**

Swagger provides an interactive interface for viewing and testing the API endpoints.
	
Start the backend application and open:

```text
http://localhost:3000/api-docs
```

### 4.0 Loggin-in as ADMIN

To loggin in as existing ADMIN in our database. \
Run the post man post with this url:

```bash
http:localhost:port/auth/login
```

(The port is either local npm (3000) and docker (8084))

Select POST request, click the "BODY" then "raw", paste this json:

```json
{
    "email": "admin@hotel.example.com",
    "password": "Test1234"
}
```

The return result will be the newly issued JWT token of that admin account. \
If you are using postman only, please use the AUTHORIZATION option of BEARER TOKEN.
Paste that given JWT into the input form. \
***(All hashed password are computed from "Test1234" with  salth = 12)***

### 4.1 How to use Swagger

1. Expand the endpoint you want to test.
2. Select **Try it out**.
3. Enter the required parameters or JSON request body.
4. Select **Execute**.
5. Check the HTTP status code and response body.

### 4.2 Authentication with JWT

Most of the endpoints require authentication.

To obtain a token:

1. Open `POST /auth/register` to register a USER account.
2. Open `POST /auth/login`.
3. Enter the registered email and password.
4. Execute the request.
5. Copy the returned JWT access token.
6. Select **Authorize** in Swagger.
7. Enter the access token for the bearer authentication scheme.
8. Confirm authorization.

Swagger will attach the token to subsequent requests that require bearer authentication.

**Authorization rules:**

| Role | Access |
| --- | --- |
| Public | No authentication required |
| USER | Authenticated USER account |
| ADMIN | Authenticated ADMIN account |

For ADMIN-protected endpoints, use an existing ADMIN account and its access token generated upon loggin in.

---

## **5. Manual API Testing with Swagger**

This section describes how to test the API endpoints individually.

Use the request bodies below as examples. For optional fields, refer to the DTO schema displayed in Swagger.

### 5.1 Authentication API

Authentication endpoints use the `/auth` prefix.

#### Test 1: Register a new user

- **Method:** POST
- **Endpoint:** `/auth/register`
- **Authentication:** Not required

Request body:

```json
{
  "name": "Swagger Test User",
  "email": "swagger-user@example.com",
  "password": "TestPassword123!"
}
```

Expected result:

- Status: `201 Created`
- A success message is returned.
- The response contains the user ID, name, email, and role.
- The new account has the `USER` role.
- The password is not returned.

#### Test 2: Register with an existing email

- **Method:** POST
- **Endpoint:** `/auth/register`
- **Authentication:** Not required

Use the same email from Test 1.

Expected result:

- Status: `409 Conflict`
- The API reports that the email already exists.

#### Test 3: Register with an invalid email

- **Method:** POST
- **Endpoint:** `/auth/register`

Request body:

```json
{
  "name": "Invalid Email User",
  "email": "invalid-email",
  "password": "TestPassword123!"
}
```

Expected result:

- Status: `400 Bad Request`
- Email validation fails.

#### Test 4: Register without a required name

- **Method:** POST
- **Endpoint:** `/auth/register`

Request body:

```json
{
  "email": "missing-name@example.com",
  "password": "TestPassword123!"
}
```

Expected result:

- Status: `400 Bad Request`
- Name validation fails.

#### Test 5: Login with valid credentials

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Authentication:** Not required

Request body:

```json
{
  "email": "swagger-user@example.com",
  "password": "TestPassword123!"
}
```

Expected result:

- Status: `200 OK`
- A JWT access token is returned as plain text.
- Copy the token for authenticated requests.

#### Test 6: Login with an incorrect password

- **Method:** POST
- **Endpoint:** `/auth/login`

Request body:

```json
{
  "email": "swagger-user@example.com",
  "password": "WrongPassword123!"
}
```

Expected result:

- Status: `401 Unauthorized`
- The API returns an invalid credentials error.

#### Test 7: Login with an unknown email

- **Method:** POST
- **Endpoint:** `/auth/login`

Request body:

```json
{
  "email": "unknown-user@example.com",
  "password": "TestPassword123!"
}
```

Expected result:

- Status: `401 Unauthorized`

#### Test 8: Logout

- **Method:** POST
- **Endpoint:** `/auth/logout`

Request body:

```json
{
  "token": "PASTE_YOUR_ACCESS_TOKEN_HERE"
}
```

Expected result:

- Status: `200 OK`
- The corresponding token record is deleted.

#### Test 9: Refresh an access token

- **Method:** POST
- **Endpoint:** `/auth/refresh`

Request body:

```json
{
  "email": "swagger-user@example.com",
  "password": "TestPassword123!",
  "token": "PASTE_YOUR_CURRENT_ACCESS_TOKEN_HERE"
}
```

Expected result:

- Status: `200 OK`
- A new JWT is returned as plain text.
- The old token is replaced by the new token.

Run this test before logging out the account.

---

### 5.2 Room API

Room endpoints use the `/room` prefix.

#### Test 10: Get all rooms

- **Method:** GET
- **Endpoint:** `/room`
- **Authentication:** Not required

Expected result:

- Status: `200 OK`
- An array of room records is returned.

#### Test 11: Get a room by ID

- **Method:** GET
- **Endpoint:** `/room/{id}`
- **Authentication:** Not required

Example:

```text
/room/1
```

Expected result:

- The room information is returned when the specified room exists.

#### Test 12: Create a room without authentication

- **Method:** POST
- **Endpoint:** `/room`
- **Authentication:** Not provided

Request body:

```json
{
  "name": "Swagger Test Room",
  "description": "Room created for API testing",
  "capacity": 2,
  "pricePerNight": 1500,
  "isActive": true
}
```

Expected result:

- Status: `401 Unauthorized`

#### Test 13: Create a room as USER

- **Method:** POST
- **Endpoint:** `/room`
- **Authentication:** USER bearer token

Use the request body from Test 12.

Expected result:

- Status: `403 Forbidden`

#### Test 14: Create a room as ADMIN

- **Method:** POST
- **Endpoint:** `/room`
- **Authentication:** ADMIN bearer token

Use the request body from Test 12.

Expected result:

- Status: `201 Created`
- A new room is created.
- Save the returned room ID for subsequent tests.

#### Test 15: Update a room

- **Method:** PATCH
- **Endpoint:** `/room/{id}`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "name": "Updated Swagger Test Room",
  "description": "Updated room description",
  "capacity": 3,
  "isActive": true
}
```

Expected result:

- The room information is updated.
- Check the response to confirm the changes.

#### Test 16: Disable a room

- **Method:** PATCH
- **Endpoint:** `/room/{id}/disable`
- **Authentication:** ADMIN bearer token

Expected result:

- The room is disabled.
- Its active status becomes `false`.

#### Test 17: Enable a room

- **Method:** PATCH
- **Endpoint:** `/room/{id}/enable`
- **Authentication:** ADMIN bearer token

Expected result:

- The room is enabled.
- Its active status becomes `true`.

#### Test 18: Search for rooms

- **Method:** POST
- **Endpoint:** `/room/search`
- **Authentication:** Not required

Example request body:

```json
{
  "name": "Swagger Test Room",
  "capacity": 2,
  "pricePerNight": 1500,
  "isActive": true
}
```

Expected result:

- Status: `200 OK`
- Matching room records are returned.

Search parameters are optional. Date filters can also be supplied using `startDate` and `endDate`.

#### Test 19: Delete a room

- **Method:** DELETE
- **Endpoint:** `/room/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The room is deleted if database relationship constraints allow it.

---

### 5.3 Booking API

Booking endpoints use the `/booking` prefix.

#### Test 20: Create a booking as USER

- **Method:** POST
- **Endpoint:** `/booking`
- **Authentication:** USER bearer token

Request body:

```json
{
  "roomId": 1,
  "checkIn": "2027-02-10T00:00:00.000Z",
  "checkOut": "2027-02-12T00:00:00.000Z",
  "guest": 2
}
```

Expected result:

- Status: `201 Created`
- A booking is created for the authenticated user.
- The initial booking status is `PENDING`.
- The total amount is calculated from the room price and number of nights.

#### Test 21: Create a booking with an invalid date range

- **Method:** POST
- **Endpoint:** `/booking`
- **Authentication:** USER bearer token

Request body:

```json
{
  "roomId": 1,
  "checkIn": "2027-02-12T00:00:00.000Z",
  "checkOut": "2027-02-10T00:00:00.000Z",
  "guest": 2
}
```

Expected result:

- Status: `400 Bad Request`
- The booking is rejected because the check-out date is earlier than the check-in date.

#### Test 22: Create a booking with an inactive or invalid room

- **Method:** POST
- **Endpoint:** `/booking`
- **Authentication:** USER bearer token

Use a room ID that does not exist or refers to an inactive room.

Expected result:

- Status: `400 Bad Request`
- The booking is rejected.

#### Test 23: Create a booking exceeding room capacity

- **Method:** POST
- **Endpoint:** `/booking`
- **Authentication:** USER bearer token

Example request body:

```json
{
  "roomId": 1,
  "checkIn": "2027-03-10T00:00:00.000Z",
  "checkOut": "2027-03-12T00:00:00.000Z",
  "guest": 100
}
```

Expected result:

- Status: `400 Bad Request`
- The guest count exceeds the room capacity.

#### Test 24: Create an overlapping booking

- **Method:** POST
- **Endpoint:** `/booking`
- **Authentication:** USER bearer token

Use the same room ID and overlapping dates as an existing `PENDING`, `APPROVED`, or `PAID` booking.

Expected result:

- Status: `400 Bad Request`
- The API reports that the room is already booked for the selected dates.

#### Test 25: Get the authenticated user's bookings

- **Method:** GET
- **Endpoint:** `/booking/my`
- **Authentication:** USER bearer token

Expected result:

- Status: `200 OK`
- Only bookings belonging to the authenticated user are returned.

#### Test 26: Get all bookings

- **Method:** GET
- **Endpoint:** `/booking`
- **Authentication:** ADMIN bearer token

Expected result:

- Status: `200 OK`
- Booking records are returned.

#### Test 27: Get a booking by ID

- **Method:** GET
- **Endpoint:** `/booking/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The corresponding booking information is returned.

#### Test 28: Update a booking

- **Method:** PATCH
- **Endpoint:** `/booking/{id}`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "status": "CANCELLED"
}
```

Expected result:

- The booking status is updated.
- The corresponding notification behavior is triggered.

#### Test 29: Delete a booking

- **Method:** DELETE
- **Endpoint:** `/booking/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified booking is deleted if database constraints allow it.

#### Test 30: Create a booking as ADMIN

- **Method:** POST
- **Endpoint:** `/booking/admin`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "userId": 1,
  "roomId": 1,
  "checkIn": "2027-04-10T00:00:00.000Z",
  "checkOut": "2027-04-12T00:00:00.000Z",
  "guest": 2
}
```

Expected result:

- A booking is created for the specified user if the room and booking data pass validation.

---

### 5.4 User API

User endpoints use the `/user` prefix.

These endpoints require authentication and ADMIN authorization, except for any route explicitly documented otherwise in the controller.

#### Test 31: Create a user

- **Method:** POST
- **Endpoint:** `/user`
- **Authentication:** ADMIN bearer token

Use the request schema displayed in Swagger. The DTO accepts fields including:

- `name`
- `email`
- `passwordHash`
- `role`
- `isActive`

Expected result:

- The user record is created if the supplied fields pass validation and database constraints.

**Important:** This endpoint accepts `passwordHash`, not a plaintext password. Do not submit an ordinary password as if the endpoint hashes it automatically.

#### Test 32: Get all users

- **Method:** GET
- **Endpoint:** `/user`
- **Authentication:** ADMIN bearer token

Expected result:

- User records are returned.

#### Test 33: Get a user by ID

- **Method:** GET
- **Endpoint:** `/user/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified user record is returned.

#### Test 34: Update a user

- **Method:** PATCH
- **Endpoint:** `/user/{id}`
- **Authentication:** ADMIN bearer token

Use the fields supported by the update DTO.

Expected result:

- The specified user record is updated.

#### Test 35: Delete a user

- **Method:** DELETE
- **Endpoint:** `/user/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The user is deleted if database constraints allow it.

---

### 5.5 Notification API

Notification endpoints use the `/notification` prefix and require an ADMIN bearer token.

The notification creation DTO includes:

- `userId`
- `bookingId`
- `type`
- `message`
- `isRead`
- `createdAt`

Use a valid `notification_type` value from the Swagger schema.

#### Test 36: Create a notification

- **Method:** POST
- **Endpoint:** `/notification`
- **Authentication:** ADMIN bearer token

Enter the required notification fields using the Swagger schema.

Expected result:

- A notification is created if validation and database constraints are satisfied.

#### Test 37: Get all notifications

- **Method:** GET
- **Endpoint:** `/notification`
- **Authentication:** ADMIN bearer token

Expected result:

- Notification records are returned.

#### Test 38: Get a notification by ID

- **Method:** GET
- **Endpoint:** `/notification/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified notification is returned.

#### Test 39: Update a notification

- **Method:** PATCH
- **Endpoint:** `/notification/{id}`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "isRead": true
}
```

Expected result:

- The notification is updated.

#### Test 40: Delete a notification

- **Method:** DELETE
- **Endpoint:** `/notification/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The notification is deleted.

---

### 5.6 Refresh Token API

Refresh-token management endpoints use the `/refresh-token` prefix and require an ADMIN bearer token.

#### Test 41: Create a refresh-token record

- **Method:** POST
- **Endpoint:** `/refresh-token`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "userId": 1,
  "tokenHash": "example-token-hash",
  "expiresAt": "2027-05-01T00:00:00.000Z"
}
```

Expected result:

- A refresh-token record is created if the user and supplied data are valid.

#### Test 42: Get all refresh-token records

- **Method:** GET
- **Endpoint:** `/refresh-token`
- **Authentication:** ADMIN bearer token

Expected result:

- Refresh-token records are returned.

#### Test 43: Get a refresh-token record by ID

- **Method:** GET
- **Endpoint:** `/refresh-token/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified record is returned.

#### Test 44: Update a refresh-token record

- **Method:** PATCH
- **Endpoint:** `/refresh-token/{id}`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "revokedAt": "2027-05-01T00:00:00.000Z"
}
```

Expected result:

- The record is updated if the supplied data passes validation.

#### Test 45: Delete a refresh-token record

- **Method:** DELETE
- **Endpoint:** `/refresh-token/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified record is deleted.

---

### 5.7 Room Image API

Room-image endpoints use the `/room-image` prefix and require an ADMIN bearer token.

The creation DTO includes:

- `roomId`
- `url`
- `storageKey` (optional)
- `mimeType` (optional)
- `fileSize` (optional)
- `isPrimary`
- `createdAt`

#### Test 46: Create a room image

- **Method:** POST
- **Endpoint:** `/room-image`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "roomId": 1,
  "url": "https://example.com/room-image.jpg",
  "storageKey": "swagger-test-image",
  "mimeType": "image/jpeg",
  "fileSize": 1024,
  "isPrimary": true
}
```

Expected result:

- A room-image record is created if the associated room exists and the supplied data is valid.

#### Test 47: Get all room images

- **Method:** GET
- **Endpoint:** `/room-image`
- **Authentication:** ADMIN bearer token

Expected result:

- Room-image records are returned.

#### Test 48: Get a room image by ID

- **Method:** GET
- **Endpoint:** `/room-image/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified room-image record is returned.

#### Test 49: Update a room image

- **Method:** PATCH
- **Endpoint:** `/room-image/{id}`
- **Authentication:** ADMIN bearer token

Example request body:

```json
{
  "url": "https://example.com/updated-room-image.jpg",
  "isPrimary": false
}
```

Expected result:

- The room-image record is updated.

#### Test 50: Delete a room image

- **Method:** DELETE
- **Endpoint:** `/room-image/{id}`
- **Authentication:** ADMIN bearer token

Expected result:

- The specified room-image record is deleted.

---

## **6. Automated Testing**

The project uses Jest and Supertest to test individual modules and complete API workflows.

### 6.1 Unit Tests

Unit tests verify the behavior of individual controllers, services, guards, and other components.

Run all unit tests:

```bash
npm run test
```

Run tests in serial mode:

```bash
npm run test -- --runInBand
```

Run tests with coverage:

```bash
npm run test:cov
```

### Verified Unit Test Result

The following result was verified during development:

```text
Test Suites: 19 passed, 19 total
Tests:       153 passed, 153 total
Snapshots:   0 total
```

### 6.2 End-to-End Tests

E2E tests verify complete API workflows using HTTP requests.

Run the complete E2E test suite:

```bash
npm run test:e2e
```

**Important:** Run the complete suite rather than individual tests. Some test cases depend on data created by earlier tests.

The E2E test setup automatically creates the required test accounts and data. It also performs test cleanup. The ADMIN test account is promoted directly through Prisma inside the automated setup.

No manual test-account provisioning is required.

### E2E Test Cases

The following 18 test cases are included in the verified E2E suite.

| No. | Test case | Expected result |
| ---: | --- | --- |
| 1 | GET `/` | `200 OK`; application welcome message |
| 2 | GET `/room` without authentication | `200 OK`; room records returned |
| 3 | POST `/room` without authentication | `401 Unauthorized` |
| 4 | POST `/room` as ADMIN | `201 Created`; room created |
| 5 | POST `/room` as USER | `403 Forbidden` |
| 6 | POST `/booking` as USER | `201 Created`; booking created with `PENDING` status |
| 7 | POST an overlapping booking | `400 Bad Request` |
| 8 | ADMIN changes booking status to `CANCELLED` | `200 OK`; notification side effect triggered |
| 9 | Register a new user | `201 Created`; USER account created |
| 10 | Register with duplicate email | `409 Conflict` |
| 11 | Register without a name | `400 Bad Request` |
| 12 | Register with invalid email | `400 Bad Request` |
| 13 | Login with valid credentials | `200 OK`; JWT returned and stored |
| 14 | Login again with valid credentials | `200 OK`; existing valid token reused |
| 15 | Login with incorrect password | `401 Unauthorized` |
| 16 | Login with unknown email | `401 Unauthorized` |
| 17 | Logout with a valid token | `200 OK`; token record deleted |
| 18 | Refresh a valid token | `200 OK`; new token replaces old token |

### E2E Test Data

The E2E tests generate unique email addresses dynamically using timestamps.

Examples of the generated email formats:

```text
e2e-registration-{timestamp}@example.com
e2e-admin-{timestamp}@example.com
e2e-room-user-{timestamp}@example.com
```

The test setup defines the corresponding passwords and creates the required test data automatically.

### Verified E2E Test Result

The following result was verified during development:

```text
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
```

## **7. Expected Testing Summary**

| Testing method | Verified result |
| --- | --- |
| TypeScript compilation | Passed |
| Unit test suites | 19 passed |
| Unit test cases | 153 passed |
| E2E test suites | 1 passed |
| E2E test cases | 18 passed |

The tests verify authentication, authorization, input validation, room management, booking workflows, and related backend functionality.

---

