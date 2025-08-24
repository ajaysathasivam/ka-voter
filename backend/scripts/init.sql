-- Create database (run once if not exists)
CREATE DATABASE IF NOT EXISTS `voter_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `voter_db`;


-- Admins table
CREATE TABLE IF NOT EXISTS admins (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(64) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Optional: index for lookup
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);


-- You can insert a temp admin with a raw hash. Prefer using the seed script to hash.