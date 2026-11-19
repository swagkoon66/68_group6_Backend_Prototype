## Testing

The project uses Jest for unit testing and Supertest for end-to-end (E2E) testing.

### 1. Unit Testing

Run all unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:cov
```

### 2. End-to-End Testing

Run the E2E test suite:

```bash
npm run test:e2e
```

The E2E tests use a separate test environment configured through `.env.test`. Make sure the test database is configured separately from the development database.

### 3. TypeScript Compilation Check

Check for TypeScript compilation errors:

```bash
npx tsc --noEmit
```

## API Testing

API testing is performed using end-to-end tests with Jest and Supertest to verify HTTP endpoints, authentication, authorization, request validation, and database operations.

### 1. API Testing Environment

| Component | Configuration |
|---|---|
| Testing framework | Jest |
| HTTP testing library | Supertest |
| Test environment | `.env.test` |
| Test database | Separate MySQL test database |
| Authentication | JWT |
| Validation | NestJS ValidationPipe |

### 2. API Test Scenarios

The following API scenarios are covered by the E2E tests.

| Module | Test scenarios |
|---|---|
| Application | Verify the root endpoint response |
| Rooms | Retrieve rooms publicly and verify unauthorized room creation is rejected |
| Rooms | Verify administrators can create rooms and normal users cannot |
| Authentication | Register users, reject duplicate registrations, and validate invalid registration data |
| Authentication | Verify successful login, incorrect passwords, and unknown email handling |
| Authentication | Test logout and refresh token operations |
| Bookings | Verify authenticated users can create bookings |
| Bookings | Reject overlapping bookings |
| Bookings | Verify administrators can cancel bookings |
| Notifications | Verify notification records created during booking operations |
| Database | Verify booking and notification states after API operations |

### 3. Authentication and Authorization Testing

The API tests verify access control for different user roles:

- **Public access:** Public room retrieval endpoints can be accessed without authentication.
- **USER role:** Authenticated users can create bookings and retrieve their own bookings.
- **ADMIN role:** Administrators can manage rooms and bookings.
- **Unauthorized requests:** Requests without valid authentication are rejected for protected endpoints.
- **Forbidden requests:** Users without the required role cannot access administrator-only operations.

### 4. API Test Results

The following results were obtained during the testing process:

| Test execution | Result |
|---|---:|
| Full Jest regression run | 19 test suites passed |
| Full Jest regression run | 153 tests passed |
| Separate E2E run | 1 test suite passed |
| Separate E2E run | 18 tests passed |
| TypeScript compilation | Passed |

### 5. Test Data and Cleanup

- E2E tests use a dedicated test database.
- Test users, rooms, bookings, and related records are tracked for cleanup.
- Notifications are deleted before their associated bookings.
- Test records are cleaned up after test execution to reduce interference between test runs.
- The test database should not contain production data.

