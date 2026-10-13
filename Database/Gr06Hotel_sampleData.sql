USE `Gr06Hotel`;

-- =========================================================
-- 1. USERS
-- =========================================================

INSERT INTO `user`
(`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`)
VALUES
(1,
 'Nattapong Srisuk',
 'nattapong.srisuk@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-01-12 09:24:15',
 '2026-01-12 09:24:15'),

(2,
 'Pimchanok Rattanakul',
 'pimchanok.rattanakul@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-02-03 14:18:42',
 '2026-02-03 14:18:42'),

(3,
 'Thanawat Chaiyasit',
 'thanawat.chaiyasit@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-02-18 11:05:27',
 '2026-02-18 11:05:27'),

(4,
 'Sirinapa Wongsa',
 'sirinapa.wongsa@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-03-07 16:42:09',
 '2026-03-07 16:42:09'),

(5,
 'Kittipong Boonmee',
 'kittipong.boonmee@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-03-21 10:31:55',
 '2026-03-21 10:31:55'),

(6,
 'Worawan Saelim',
 'worawan.saelim@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-04-02 13:17:33',
 '2026-04-02 13:17:33'),

(7,
 'Admin Hotel',
 'admin@gr06hotel.example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN',
 TRUE,
 '2025-12-15 08:00:00',
 '2026-01-10 09:15:22'),

(8,
 'Arthit Phromsri',
 'arthit.phromsri@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-05-11 15:26:18',
 '2026-05-11 15:26:18');


-- =========================================================
-- 2. ROOMS
-- =========================================================

INSERT INTO `room`
(`id`, `name`, `description`, `capacity`, `price_per_night`, `is_active`, `created_at`, `updated_at`)
VALUES
(1,
 'Deluxe King Room',
 'A comfortable room with one king-size bed, work desk, private bathroom, and city view.',
 2,
 2800.00,
 TRUE,
 '2025-12-01 10:00:00',
 '2025-12-01 10:00:00'),

(2,
 'Deluxe Twin Room',
 'A spacious room with two single beds, private bathroom, work desk, and city view.',
 2,
 2800.00,
 TRUE,
 '2025-12-01 10:05:00',
 '2025-12-01 10:05:00'),

(3,
 'Premier King Room',
 'A larger king room featuring a seating area, work desk, and upgraded bathroom facilities.',
 2,
 3600.00,
 TRUE,
 '2025-12-01 10:10:00',
 '2025-12-01 10:10:00'),

(4,
 'Family Room',
 'A family-friendly room with one king-size bed and two single beds.',
 4,
 4500.00,
 TRUE,
 '2025-12-01 10:15:00',
 '2025-12-01 10:15:00'),

(5,
 'Executive Suite',
 'A spacious suite with separate living and sleeping areas, suitable for business or extended stays.',
 2,
 5200.00,
 TRUE,
 '2025-12-01 10:20:00',
 '2025-12-01 10:20:00'),

(6,
 'Triple Room',
 'A practical room with three single beds, suitable for small groups or families.',
 3,
 3900.00,
 TRUE,
 '2025-12-01 10:25:00',
 '2025-12-01 10:25:00');


-- =========================================================
-- 3. ROOM IMAGES
-- =========================================================

INSERT INTO `room_image`
(`id`, `room_id`, `url`, `storage_key`, `mime_type`, `file_size`, `is_primary`, `created_at`)
VALUES
(1,
 1,
 'https://cdn.gr06hotel.example.com/rooms/deluxe-king-01.jpg',
 'rooms/deluxe-king-01.jpg',
 'image/jpeg',
 284512,
 TRUE,
 '2025-12-01 11:30:00'),

(2,
 1,
 'https://cdn.gr06hotel.example.com/rooms/deluxe-king-02.jpg',
 'rooms/deluxe-king-02.jpg',
 'image/jpeg',
 319847,
 FALSE,
 '2025-12-01 11:31:00'),

(3,
 2,
 'https://cdn.gr06hotel.example.com/rooms/deluxe-twin-01.jpg',
 'rooms/deluxe-twin-01.jpg',
 'image/jpeg',
 301264,
 TRUE,
 '2025-12-01 11:35:00'),

(4,
 3,
 'https://cdn.gr06hotel.example.com/rooms/premier-king-01.jpg',
 'rooms/premier-king-01.jpg',
 'image/jpeg',
 347921,
 TRUE,
 '2025-12-01 11:40:00'),

(5,
 4,
 'https://cdn.gr06hotel.example.com/rooms/family-01.jpg',
 'rooms/family-01.jpg',
 'image/jpeg',
 368442,
 TRUE,
 '2025-12-01 11:45:00'),

(6,
 5,
 'https://cdn.gr06hotel.example.com/rooms/executive-suite-01.jpg',
 'rooms/executive-suite-01.jpg',
 'image/jpeg',
 412638,
 TRUE,
 '2025-12-01 11:50:00'),

(7,
 6,
 'https://cdn.gr06hotel.example.com/rooms/triple-01.jpg',
 'rooms/triple-01.jpg',
 'image/jpeg',
 325774,
 TRUE,
 '2025-12-01 11:55:00');


-- =========================================================
-- 4. BOOKINGS
-- =========================================================

INSERT INTO `booking`
(`id`, `user_id`, `room_id`, `check_in`, `check_out`, `guest`,
 `status`, `price_per_night`, `total_amount`, `created_at`, `updated_at`)
VALUES

-- Nattapong - Deluxe King - 3 nights
(1,
 1,
 1,
 '2026-09-18 14:00:00',
 '2026-09-21 12:00:00',
 2,
 'PAID',
 2800.00,
 8400.00,
 '2026-08-28 10:42:17',
 '2026-08-28 10:50:03'),

-- Pimchanok - Premier King - 2 nights
(2,
 2,
 3,
 '2026-09-20 14:00:00',
 '2026-09-22 12:00:00',
 1,
 'APPROVED',
 3600.00,
 7200.00,
 '2026-09-02 15:21:44',
 '2026-09-02 15:25:12'),

-- Thanawat - Family Room - 4 nights
(3,
 3,
 4,
 '2026-09-25 14:00:00',
 '2026-09-29 12:00:00',
 4,
 'PENDING',
 4500.00,
 18000.00,
 '2026-09-10 09:14:32',
 '2026-09-10 09:14:32'),

-- Sirinapa - Deluxe Twin - 2 nights
(4,
 4,
 2,
 '2026-09-27 14:00:00',
 '2026-09-29 12:00:00',
 2,
 'CANCELLED',
 2800.00,
 5600.00,
 '2026-09-05 13:37:26',
 '2026-09-12 16:08:41'),

-- Kittipong - Executive Suite - 5 nights
(5,
 5,
 6,
 '2026-10-03 14:00:00',
 '2026-10-08 12:00:00',
 2,
 'APPROVED',
 5200.00,
 26000.00,
 '2026-09-08 11:19:05',
 '2026-09-08 11:22:31'),

-- Worawan Saelim - Executive Suite - 5 nights at freddy's
(6,
 5,
 6,
 '2026-10-03 14:00:00',
 '2026-10-08 12:00:00',
 2,
 'CANCELLED',
 67,
 67,
 '2026-09-08 11:19:05',
 '2026-09-08 11:22:31'),

-- Worawan - Triple Room - 3 nights
(7,
 7,
 6,
 '2026-10-10 14:00:00',
 '2026-10-13 12:00:00',
 3,
 'PENDING',
 3900.00,
 11700.00,
 '2026-09-11 17:05:49',
 '2026-09-11 17:05:49'),

-- Arthit - Deluxe King - 1 night
(8,
 8,
 1,
 '2026-09-15 14:00:00',
 '2026-09-16 12:00:00',
 1,
 'APPROVED',
 2800.00,
 2800.00,
 '2026-09-09 08:48:22',
 '2026-09-09 08:51:09'),

-- Nattapong - Deluxe Twin - cancelled
(9,
 1,
 2,
 '2026-08-22 14:00:00',
 '2026-08-24 12:00:00',
 2,
 'CANCELLED',
 2800.00,
 5600.00,
 '2026-08-05 12:14:36',
 '2026-08-12 09:17:44'),

-- Pimchanok - Family Room - 2 nights
(10,
 2,
 4,
 '2026-11-05 14:00:00',
 '2026-11-07 12:00:00',
 3,
 'PAID',
 4500.00,
 9000.00,
 '2026-09-01 14:52:18',
 '2026-09-01 15:03:27'),

-- Thanawat - Deluxe King - 2 nights
(11,
 3,
 1,
 '2026-07-14 14:00:00',
 '2026-07-16 12:00:00',
 2,
 'PAID',
 2800.00,
 5600.00,
 '2026-06-25 10:32:47',
 '2026-06-25 10:41:15');


-- =========================================================
-- 5. NOTIFICATIONS
-- =========================================================

INSERT INTO `notification`
(`id`, `user_id`, `booking_id`, `type`, `message`, `is_read`, `created_at`)
VALUES

(1,
 1,
 1,
 'BOOKING_CREATED',
 'Your booking for Deluxe King Room has been created.',
 TRUE,
 '2026-08-28 10:42:18'),

(2,
 1,
 1,
 'BOOKING_PAID',
 'Payment for your booking from September 18 to September 21 has been received.',
 TRUE,
 '2026-08-28 10:50:04'),

(3,
 2,
 2,
 'BOOKING_CREATED',
 'Your booking for Premier King Room has been created.',
 TRUE,
 '2026-09-02 15:21:45'),

(4,
 2,
 2,
 'BOOKING_APPROVED',
 'Your booking for Premier King Room has been approved.',
 FALSE,
 '2026-09-02 15:25:13'),

(5,
 3,
 3,
 'BOOKING_CREATED',
 'Your booking for Family Room has been created and is awaiting approval.',
 FALSE,
 '2026-09-10 09:14:33'),

(6,
 4,
 4,
 'BOOKING_CANCELLED',
 'Your booking for Deluxe Twin Room has been cancelled.',
 TRUE,
 '2026-09-12 16:08:42'),

(7,
 5,
 5,
 'BOOKING_CREATED',
 'Your booking for Executive Suite has been created.',
 TRUE,
 '2026-09-08 11:19:06'),

(8,
 5,
 5,
 'BOOKING_APPROVED',
 'Your booking for Executive Suite has been approved.',
 FALSE,
 '2026-09-08 11:22:32'),

(9,
 6,
 6,
 'BOOKING_CREATED',
 'Your booking for Triple Room has been created and is awaiting approval.',
 FALSE,
 '2026-09-11 17:05:50'),

(10,
 8,
 7,
 'BOOKING_CREATED',
 'Your booking for Deluxe King Room has been created.',
 TRUE,
 '2026-09-09 08:48:23'),

(11,
 8,
 7,
 'BOOKING_APPROVED',
 'Your booking for Deluxe King Room has been approved.',
 FALSE,
 '2026-09-09 08:51:10'),

(12,
 1,
 7,
 'BOOKING_CANCELLED',
 'Your booking for Deluxe Twin Room has been cancelled.',
 TRUE,
 '2026-08-12 09:17:45');


-- =========================================================
-- 6. REFRESH TOKENS
-- =========================================================

INSERT INTO `refresh_token`
(`id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `created_at`)
VALUES

(1,
 1,
 '$2b$10$7JvWzq9F3Kx8mP2dN6rT5uA4cB1eS9gH0yL7iO3pQ6wX2zR8vN4kM',
 '2026-10-12 10:42:17',
 NULL,
 '2026-09-12 10:42:17'),

(2,
 2,
 '$2b$10$4LmX8pQ2vN7cR5sT9yK3wA6dF1gH8jB0eZ4iO7uP2xC5mV9nS6q',
 '2026-10-02 15:21:44',
 NULL,
 '2026-09-02 15:21:44'),

(3,
 3,
 '$2b$10$8QwE3rT6yU9iO2pA5sD7fG1hJ4kL6zX0cV8bN3mM5xC9vP2sR7',
 '2026-10-10 09:14:32',
 NULL,
 '2026-09-10 09:14:32'),

(4,
 4,
 '$2b$10$3NzV7xQ4mL8cR2pK5wT9yA6dF1gH0jB4eS8iO3uP7xC5vM2nQ6',
 '2026-09-20 13:37:26',
 '2026-09-12 16:08:41',
 '2026-08-20 13:37:26'),

(5,
 5,
 '$2b$10$6RtY2uI9oP4aS7dF1gH8jK3lZ5xC0vB6nM9qW2eR7tY4uI8oP5',
 '2026-10-08 11:19:05',
 NULL,
 '2026-09-08 11:19:05'),

(6,
 6,
 '$2b$10$9QxW3eR6tY8uI1oP4aS7dF2gH5jK0lZ6xC8vB9nM3qW7eR2tY5',
 '2026-10-11 17:05:49',
 NULL,
 '2026-09-11 17:05:49'),

(7,
 8,
 '$2b$10$2LpQ8wE4rT6yU9iO3pA5sD7fG1hJ0kL6zX8cV2bN9mM4qW7eR5',
 '2026-10-09 08:48:22',
 NULL,
 '2026-09-09 08:48:22'),

(8,
 1,
 '$2b$10$5YtR8uI2oP6aS9dF3gH7jK1lZ4xC0vB8nM5qW9eR2tY6uI3oP7',
 '2026-09-20 10:42:17',
 '2026-09-05 18:22:31',
 '2026-08-21 10:42:17'),

(9,
 2,
 '$2b$10$7KxC4vB9nM2qW6eR8tY1uI5oP3aS7dF0gH9jL2zX4cV8bN6mQ',
 '2026-10-01 14:52:18',
 NULL,
 '2026-09-01 14:52:18'),

(10,
 3,
 '$2b$10$1MqW5eR8tY3uI7oP9aS2dF6gH0jK4lZ8xC5vB7nM2qW6eR9tY',
 '2026-09-24 10:32:47',
 '2026-08-30 12:10:04',
 '2026-08-24 10:32:47');