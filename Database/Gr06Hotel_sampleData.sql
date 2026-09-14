USE `Gr06Hotel`;

-- =========================================================
-- 1. USERS
-- =========================================================

INSERT INTO `user`
(`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`)
VALUES
('8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 'Nattapong Srisuk',
 'nattapong.srisuk@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-01-12 09:24:15',
 '2026-01-12 09:24:15'),

('2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 'Pimchanok Rattanakul',
 'pimchanok.rattanakul@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-02-03 14:18:42',
 '2026-02-03 14:18:42'),

('6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 'Thanawat Chaiyasit',
 'thanawat.chaiyasit@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-02-18 11:05:27',
 '2026-02-18 11:05:27'),

('d4e8a219-735b-4c60-9f12-58b6e3a74109',
 'Sirinapa Wongsa',
 'sirinapa.wongsa@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-03-07 16:42:09',
 '2026-03-07 16:42:09'),

('91c6f3a8-2e54-47b9-a015-63d8f2c74195',
 'Kittipong Boonmee',
 'kittipong.boonmee@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-03-21 10:31:55',
 '2026-03-21 10:31:55'),

('3e7a5b92-c614-48d0-9f26-71a8c3d54902',
 'Worawan Saelim',
 'worawan.saelim@example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'USER',
 TRUE,
 '2026-04-02 13:17:33',
 '2026-04-02 13:17:33'),

('b5d92174-8c36-4fa2-a107-59e3c6f28140',
 'Admin Hotel',
 'admin@gr06hotel.example.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN',
 TRUE,
 '2025-12-15 08:00:00',
 '2026-01-10 09:15:22'),

('47f2c8a6-1d93-4b75-ae08-62c5f9d31427',
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
('101a7c92-45de-4f18-b263-8a5d91e70436',
 'Deluxe King Room',
 'A comfortable room with one king-size bed, work desk, private bathroom, and city view.',
 2,
 2800.00,
 TRUE,
 '2025-12-01 10:00:00',
 '2025-12-01 10:00:00'),

('214b8e63-79c1-46d5-a092-37f4e8c61529',
 'Deluxe Twin Room',
 'A spacious room with two single beds, private bathroom, work desk, and city view.',
 2,
 2800.00,
 TRUE,
 '2025-12-01 10:05:00',
 '2025-12-01 10:05:00'),

('327c5f91-a842-4e76-b103-69d2f8a41537',
 'Premier King Room',
 'A larger king room featuring a seating area, work desk, and upgraded bathroom facilities.',
 2,
 3600.00,
 TRUE,
 '2025-12-01 10:10:00',
 '2025-12-01 10:10:00'),

('438d71a5-c926-4b83-9e04-52f6a817d230',
 'Family Room',
 'A family-friendly room with one king-size bed and two single beds.',
 4,
 4500.00,
 TRUE,
 '2025-12-01 10:15:00',
 '2025-12-01 10:15:00'),

('549e82b6-d137-4c94-a205-73b9f618e341',
 'Executive Suite',
 'A spacious suite with separate living and sleeping areas, suitable for business or extended stays.',
 2,
 5200.00,
 TRUE,
 '2025-12-01 10:20:00',
 '2025-12-01 10:20:00'),

('65af93c7-e248-4da5-b316-84c0a729f452',
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
(`id`, `room_id`, `url`, `storage_key`, `mime_type`, `file_size`, `is_primary`, `craeted_at`)
VALUES
('a101c7e4-52d8-4f93-b261-7e5a913d8042',
 '101a7c92-45de-4f18-b263-8a5d91e70436',
 'https://cdn.gr06hotel.example.com/rooms/deluxe-king-01.jpg',
 'rooms/deluxe-king-01.jpg',
 'image/jpeg',
 284512,
 TRUE,
 '2025-12-01 11:30:00'),

('b214d8f5-63e9-40a4-c372-8f6b024e9153',
 '101a7c92-45de-4f18-b263-8a5d91e70436',
 'https://cdn.gr06hotel.example.com/rooms/deluxe-king-02.jpg',
 'rooms/deluxe-king-02.jpg',
 'image/jpeg',
 319847,
 FALSE,
 '2025-12-01 11:31:00'),

('c327e9a6-74fa-41b5-d483-9a7c135f0264',
 '214b8e63-79c1-46d5-a092-37f4e8c61529',
 'https://cdn.gr06hotel.example.com/rooms/deluxe-twin-01.jpg',
 'rooms/deluxe-twin-01.jpg',
 'image/jpeg',
 301264,
 TRUE,
 '2025-12-01 11:35:00'),

('d438f0b7-85ab-42c6-e594-0b8d246a1375',
 '327c5f91-a842-4e76-b103-69d2f8a41537',
 'https://cdn.gr06hotel.example.com/rooms/premier-king-01.jpg',
 'rooms/premier-king-01.jpg',
 'image/jpeg',
 347921,
 TRUE,
 '2025-12-01 11:40:00'),

('e54901c8-96bc-43d7-f605-1c9e357b2486',
 '438d71a5-c926-4b83-9e04-52f6a817d230',
 'https://cdn.gr06hotel.example.com/rooms/family-01.jpg',
 'rooms/family-01.jpg',
 'image/jpeg',
 368442,
 TRUE,
 '2025-12-01 11:45:00'),

('f65012d9-a7cd-44e8-0616-2daf468c3597',
 '549e82b6-d137-4c94-a205-73b9f618e341',
 'https://cdn.gr06hotel.example.com/rooms/executive-suite-01.jpg',
 'rooms/executive-suite-01.jpg',
 'image/jpeg',
 412638,
 TRUE,
 '2025-12-01 11:50:00'),

('a76123e0-b8de-45f9-1727-3ebf579d4608',
 '65af93c7-e248-4da5-b316-84c0a729f452',
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
('b101a8d4-63e9-4f27-c185-7a2d913e5046',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 '101a7c92-45de-4f18-b263-8a5d91e70436',
 '2026-09-18 14:00:00',
 '2026-09-21 12:00:00',
 2,
 'PAID',
 2800.00,
 8400.00,
 '2026-08-28 10:42:17',
 '2026-08-28 10:50:03'),

-- Pimchanok - Premier King - 2 nights
('b214c9e5-74fa-4038-d296-8b3ea1256157',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 '327c5f91-a842-4e76-b103-69d2f8a41537',
 '2026-09-20 14:00:00',
 '2026-09-22 12:00:00',
 1,
 'APPROVED',
 3600.00,
 7200.00,
 '2026-09-02 15:21:44',
 '2026-09-02 15:25:12'),

-- Thanawat - Family Room - 4 nights
('b327dae6-85ab-4149-e307-9c4fb2367268',
 '6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 '438d71a5-c926-4b83-9e04-52f6a817d230',
 '2026-09-25 14:00:00',
 '2026-09-29 12:00:00',
 4,
 'PENDING',
 4500.00,
 18000.00,
 '2026-09-10 09:14:32',
 '2026-09-10 09:14:32'),

-- Sirinapa - Deluxe Twin - 2 nights
('b438ebf7-96bc-425a-f418-0d5ac3478379',
 'd4e8a219-735b-4c60-9f12-58b6e3a74109',
 '214b8e63-79c1-46d5-a092-37f4e8c61529',
 '2026-09-27 14:00:00',
 '2026-09-29 12:00:00',
 2,
 'CANCELLED',
 2800.00,
 5600.00,
 '2026-09-05 13:37:26',
 '2026-09-12 16:08:41'),

-- Kittipong - Executive Suite - 5 nights
('b549fc08-a7cd-436b-0529-1e6bd4589480',
 '91c6f3a8-2e54-47b9-a015-63d8f2c74195',
 '549e82b6-d137-4c94-a205-73b9f618e341',
 '2026-10-03 14:00:00',
 '2026-10-08 12:00:00',
 2,
 'APPROVED',
 5200.00,
 26000.00,
 '2026-09-08 11:19:05',
 '2026-09-08 11:22:31'),

-- Worawan - Triple Room - 3 nights
('b650ad19-b8de-447c-1630-2f7ce569a591',
 '3e7a5b92-c614-48d0-9f26-71a8c3d54902',
 '65af93c7-e248-4da5-b316-84c0a729f452',
 '2026-10-10 14:00:00',
 '2026-10-13 12:00:00',
 3,
 'PENDING',
 3900.00,
 11700.00,
 '2026-09-11 17:05:49',
 '2026-09-11 17:05:49'),

-- Arthit - Deluxe King - 1 night
('b761be2a-c9ef-458d-2741-3a8df67ab602',
 '47f2c8a6-1d93-4b75-ae08-62c5f9d31427',
 '101a7c92-45de-4f18-b263-8a5d91e70436',
 '2026-09-15 14:00:00',
 '2026-09-16 12:00:00',
 1,
 'APPROVED',
 2800.00,
 2800.00,
 '2026-09-09 08:48:22',
 '2026-09-09 08:51:09'),

-- Nattapong - Deluxe Twin - cancelled
('b872cf3b-d0f0-469e-3852-4b9ef78bc713',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 '214b8e63-79c1-46d5-a092-37f4e8c61529',
 '2026-08-22 14:00:00',
 '2026-08-24 12:00:00',
 2,
 'CANCELLED',
 2800.00,
 5600.00,
 '2026-08-05 12:14:36',
 '2026-08-12 09:17:44'),

-- Pimchanok - Family Room - 2 nights
('b983da4c-e1a1-47af-4963-5caf089cd824',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 '438d71a5-c926-4b83-9e04-52f6a817d230',
 '2026-11-05 14:00:00',
 '2026-11-07 12:00:00',
 3,
 'PAID',
 4500.00,
 9000.00,
 '2026-09-01 14:52:18',
 '2026-09-01 15:03:27'),

-- Thanawat - Deluxe King - 2 nights
('ba94eb5d-f2b2-48b0-a764-6db19aef0935',
 '6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 '101a7c92-45de-4f18-b263-8a5d91e70436',
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

('c101d8e5-63f9-4a27-b185-7a2e914f5061',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 'b101a8d4-63e9-4f27-c185-7a2d913e5046',
 'BOOKING_CREATED',
 'Your booking for Deluxe King Room has been created.',
 TRUE,
 '2026-08-28 10:42:18'),

('c214e9f6-74fa-4b38-c296-8b3ea1266172',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 'b101a8d4-63e9-4f27-c185-7a2d913e5046',
 'BOOKING_PAID',
 'Payment for your booking from September 18 to September 21 has been received.',
 TRUE,
 '2026-08-28 10:50:04'),

('c327fa07-85ab-4c49-d307-9c4fb2377283',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 'b214c9e5-74fa-4038-d296-8b3ea1256157',
 'BOOKING_CREATED',
 'Your booking for Premier King Room has been created.',
 TRUE,
 '2026-09-02 15:21:45'),

('c4380b18-96bc-4d5a-e418-0d5ac3488394',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 'b214c9e5-74fa-4038-d296-8b3ea1256157',
 'BOOKING_APPROVED',
 'Your booking for Premier King Room has been approved.',
 FALSE,
 '2026-09-02 15:25:13'),

('c5491c29-a7cd-4e6b-f529-1e6bd4598495',
 '6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 'b327dae6-85ab-4149-e307-9c4fb2367268',
 'BOOKING_CREATED',
 'Your booking for Family Room has been created and is awaiting approval.',
 FALSE,
 '2026-09-10 09:14:33'),

('c6502d3a-b8de-4f7c-0630-2f7ce56aa5a6',
 'd4e8a219-735b-4c60-9f12-58b6e3a74109',
 'b438ebf7-96bc-425a-f418-0d5ac3478379',
 'BOOKING_CANCELLED',
 'Your booking for Deluxe Twin Room has been cancelled.',
 TRUE,
 '2026-09-12 16:08:42'),

('c7613e4b-c9ef-408d-1741-3a8df67bc6b7',
 '91c6f3a8-2e54-47b9-a015-63d8f2c74195',
 'b549fc08-a7cd-436b-0529-1e6bd4589480',
 'BOOKING_CREATED',
 'Your booking for Executive Suite has been created.',
 TRUE,
 '2026-09-08 11:19:06'),

('c8724f5c-d0f0-419e-2852-4b9ef78cd7c8',
 '91c6f3a8-2e54-47b9-a015-63d8f2c74195',
 'b549fc08-a7cd-436b-0529-1e6bd4589480',
 'BOOKING_APPROVED',
 'Your booking for Executive Suite has been approved.',
 FALSE,
 '2026-09-08 11:22:32'),

('c983506d-e1a1-42af-3963-5caf089de8d9',
 '3e7a5b92-c614-48d0-9f26-71a8c3d54902',
 'b650ad19-b8de-447c-1630-2f7ce569a591',
 'BOOKING_CREATED',
 'Your booking for Triple Room has been created and is awaiting approval.',
 FALSE,
 '2026-09-11 17:05:50'),

('ca94617e-f2b2-43b0-a764-6db19af0e9ea',
 '47f2c8a6-1d93-4b75-ae08-62c5f9d31427',
 'b761be2a-c9ef-458d-2741-3a8df67ab602',
 'BOOKING_CREATED',
 'Your booking for Deluxe King Room has been created.',
 TRUE,
 '2026-09-09 08:48:23'),

('cb10528f-03c3-44c1-b875-7ec2fb10a0fb',
 '47f2c8a6-1d93-4b75-ae08-62c5f9d31427',
 'b761be2a-c9ef-458d-2741-3a8df67ab602',
 'BOOKING_APPROVED',
 'Your booking for Deluxe King Room has been approved.',
 FALSE,
 '2026-09-09 08:51:10'),

('cc21639a-14d4-45d2-c986-8fd30c21b1fc',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 'b872cf3b-d0f0-469e-3852-4b9ef78bc713',
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

('d101e8f5-63f9-4a27-b185-7a2e914f5062',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 '$2b$10$7JvWzq9F3Kx8mP2dN6rT5uA4cB1eS9gH0yL7iO3pQ6wX2zR8vN4kM',
 '2026-10-12 10:42:17',
 NULL,
 '2026-09-12 10:42:17'),

('d214f9a6-74fa-4b38-c296-8b3ea1266173',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 '$2b$10$4LmX8pQ2vN7cR5sT9yK3wA6dF1gH8jB0eZ4iO7uP2xC5mV9nS6q',
 '2026-10-02 15:21:44',
 NULL,
 '2026-09-02 15:21:44'),

('d3270ab7-85ab-4c49-d307-9c4fb2377284',
 '6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 '$2b$10$8QwE3rT6yU9iO2pA5sD7fG1hJ4kL6zX0cV8bN3mM5xC9vP2sR7',
 '2026-10-10 09:14:32',
 NULL,
 '2026-09-10 09:14:32'),

('d4381bc8-96bc-4d5a-e418-0d5ac3488395',
 'd4e8a219-735b-4c60-9f12-58b6e3a74109',
 '$2b$10$3NzV7xQ4mL8cR2pK5wT9yA6dF1gH0jB4eS8iO3uP7xC5vM2nQ6',
 '2026-09-20 13:37:26',
 '2026-09-12 16:08:41',
 '2026-08-20 13:37:26'),

('d5492cd9-a7cd-4e6b-f529-1e6bd4598496',
 '91c6f3a8-2e54-47b9-a015-63d8f2c74195',
 '$2b$10$6RtY2uI9oP4aS7dF1gH8jK3lZ5xC0vB6nM9qW2eR7tY4uI8oP5',
 '2026-10-08 11:19:05',
 NULL,
 '2026-09-08 11:19:05'),

('d6503dea-b8de-4f7c-0630-2f7ce56aa5a7',
 '3e7a5b92-c614-48d0-9f26-71a8c3d54902',
 '$2b$10$9QxW3eR6tY8uI1oP4aS7dF2gH5jK0lZ6xC8vB9nM3qW7eR2tY5',
 '2026-10-11 17:05:49',
 NULL,
 '2026-09-11 17:05:49'),

('d7614ebc-c9ef-408d-1741-3a8df67bc6b8',
 '47f2c8a6-1d93-4b75-ae08-62c5f9d31427',
 '$2b$10$2LpQ8wE4rT6yU9iO3pA5sD7fG1hJ0kL6zX8cV2bN9mM4qW7eR5',
 '2026-10-09 08:48:22',
 NULL,
 '2026-09-09 08:48:22'),

('d8725fcd-d0f0-419e-2852-4b9ef78cd7c9',
 '8f1c2d4e-6a72-4b91-9c35-1e8f4a7b2d10',
 '$2b$10$5YtR8uI2oP6aS9dF3gH7jK1lZ4xC0vB8nM5qW9eR2tY6uI3oP7',
 '2026-09-20 10:42:17',
 '2026-09-05 18:22:31',
 '2026-08-21 10:42:17'),

('d98360de-e1a1-42af-3963-5caf089de8da',
 '2a7e91c5-4d38-46f2-b8a1-93c7e5d01462',
 '$2b$10$7KxC4vB9nM2qW6eR8tY1uI5oP3aS7dF0gH9jL2zX4cV8bN6mQ',
 '2026-10-01 14:52:18',
 NULL,
 '2026-09-01 14:52:18'),

('da9471ef-f2b2-43b0-a764-6db19af0e9eb',
 '6b3d84f1-92e7-4a56-a0c9-17f5d2b63841',
 '$2b$10$1MqW5eR8tY3uI7oP9aS2dF6gH0jK4lZ8xC5vB7nM2qW6eR9tY',
 '2026-09-24 10:32:47',
 '2026-08-30 12:10:04',
 '2026-08-24 10:32:47');