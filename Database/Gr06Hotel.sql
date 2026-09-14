CREATE DATABASE IF NOT EXISTS `Gr06Hotel`;

USE `Gr06Hotel`;

-- 1. USERS
CREATE TABLE IF NOT EXISTS `user` (
	`id` CHAR(36) PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,	
	`password_hash` VARCHAR(255) NOT NULL,
	`role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created_at` timestamp NOT NULL DEFAULT current_timestamp,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ROOMS
CREATE TABLE IF NOT EXISTS `room` (
	`id` CHAR(36) PRIMARY KEY,
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT,
	`capacity` INT NOT NULL ,
	`price_per_night` DECIMAL(10,2) NOT NULL,
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT chk_rooms_capacity CHECK (capacity > 0),
	CONSTRAINT chk_rooms_price CHECK (price_per_night >= 0)
);

-- 3. room_images
CREATE TABLE IF NOT EXISTS room_image (
	`id` CHAR(36) PRIMARY KEY,
	`room_id` CHAR(36) NOT NULL,
	`url` VARCHAR(2048) NOT NULL,
	`storage_key` VARCHAR(512),
	`mime_type` VARCHAR(100),
	`file_size` INT,
	`is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
	`craeted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_room_images_room FOREIGN KEY (room_id) REFERENCES `room`(id) ON DELETE CASCADE,
	INDEX idx_room_images_room (room_id)
);

-- 4. bookings
CREATE TABLE IF NOT EXISTS `booking` (
	`id` CHAR(36) PRIMARY KEY,
	`user_id` CHAR(36) NOT NULL,
	`room_id` CHAR(36) NOT NULL,
	`check_in` DATETIME NOT NULL,
	`check_out` DATETIME NOT NULL,
	`guest` INT NOT NULL DEFAULT 1,
	`status` ENUM('PENDING', 'APPROVED', 'CANCELLED', 'PAID') NOT NULL DEFAULT 'PENDING',
	`price_per_night` DECIMAL(10,2) NOT NULL,
	`total_amount` DECIMAL(10,2) NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE RESTRICT,
  	CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES `room`(id) ON DELETE RESTRICT,
  	CONSTRAINT chk_bookings_dates CHECK (check_out > check_in),
  	CONSTRAINT chk_bookings_guests CHECK (guest > 0),
  	INDEX idx_bookings_room_dates (room_id, check_in, check_out, status),
  	INDEX idx_bookings_user_status (user_id, status),
  	INDEX idx_bookings_status (status)
);

-- 5. notification
CREATE TABLE IF NOT EXISTS `notification` (
	`id` CHAR(36) PRIMARY KEY,
	`user_id` CHAR(36) NOT NULL,
	`booking_id` CHAR(36) NULL,
	`type` ENUM('BOOKING_CREATED', 'BOOKING_CANCELLED', 'BOOKING_APPROVED', 'BOOKING_PAID') NOT NULL,
	`message` VARCHAR(500) NOT NULL,
  	`is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  	CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
  	CONSTRAINT fk_notifications_booking FOREIGN KEY (booking_id) REFERENCES `booking`(id) ON DELETE SET NULL,
 	INDEX idx_notifications_user_read (user_id, is_read),
 	INDEX idx_notifications_booking (booking_id)
);

-- 6. refresh_token (logout/revocation)
CREATE TABLE IF NOT EXISTS `refresh_token` (
	`id` CHAR(36) PRIMARY KEY,
	`user_id` CHAR(36) NOT NULL,
	`token_hash` VARCHAR(255) NOT NULL UNIQUE,
	`expires_at` DATETIME NOT NULL,
	`revoked_at` DATETIME NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
  	INDEX idx_refresh_tokens_user (user_id)
);

