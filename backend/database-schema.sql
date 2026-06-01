-- GlobalHub Complete Database Schema for MySQL
-- Run this script to create all databases and tables

-- Create databases for each microservice
CREATE DATABASE IF NOT EXISTS globalhub_auth;
CREATE DATABASE IF NOT EXISTS globalhub_users;
CREATE DATABASE IF NOT EXISTS globalhub_vendors;
CREATE DATABASE IF NOT EXISTS globalhub_products;
CREATE DATABASE IF NOT EXISTS globalhub_hotels;
CREATE DATABASE IF NOT EXISTS globalhub_properties;
CREATE DATABASE IF NOT EXISTS globalhub_tours;
CREATE DATABASE IF NOT EXISTS globalhub_orders;
CREATE DATABASE IF NOT EXISTS globalhub_payments;
CREATE DATABASE IF NOT EXISTS globalhub_notifications;

-- Use global_hub as main schema
USE globalhub_auth;

-- Users table (Auth Service)
CREATE TABLE IF NOT EXISTS users(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('CONSUMER', 'VENDOR', 'ADMIN') DEFAULT 'CONSUMER',
   is_verified BOOLEAN DEFAULT FALSE,
   is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to users database
USE globalhub_users;

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('HOME', 'WORK', 'OTHER') NOT NULL,
    label VARCHAR(100),
    street VARCHAR(255) NOT NULL,
   apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
   postal_code VARCHAR(20) NOT NULL,
   country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
   longitude DECIMAL(11, 8),
   is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_city (city),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to vendors database
USE globalhub_vendors;

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
   tax_number VARCHAR(50),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 0.00,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_business_type (business_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vendor documents table
CREATE TABLE IF NOT EXISTS vendor_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to products database
USE globalhub_products;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
   name VARCHAR(255) NOT NULL,
    description TEXT,
   category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
   image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) UNIQUE NOT NULL,
    parent_id BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to hotels database
USE globalhub_hotels;

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
   name VARCHAR(255) NOT NULL,
    description TEXT,
   location VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
   country VARCHAR(100),
   postal_code VARCHAR(20),
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    phone VARCHAR(20),
    email VARCHAR(255),
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_city (city),
    INDEX idx_country (country),
    INDEX idx_star_rating (star_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
   capacity INT,
    beds INT,
    available BOOLEAN DEFAULT TRUE,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_type (type),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hotel bookings table
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT,
    total_price DECIMAL(10,2),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    special_requests TEXT,
   booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to properties database
USE globalhub_properties;

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    type ENUM('HOUSE', 'APARTMENT', 'VILLA', 'COMMERCIAL', 'LAND') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    area_size DECIMAL(10,2),
    bedrooms INT,
    bathrooms INT,
    floors INT,
    year_built INT,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
   country VARCHAR(100),
   postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
   longitude DECIMAL(11, 8),
    features JSON,
    status ENUM('AVAILABLE', 'SOLD', 'RENTED', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_type (type),
    INDEX idx_city (city),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
   image_url VARCHAR(500) NOT NULL,
   caption VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_property_id (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to tours database
USE globalhub_tours;

-- Tour packages table
CREATE TABLE IF NOT EXISTS tour_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
   name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INT,
    price DECIMAL(10,2) NOT NULL,
    itinerary TEXT,
    included_services JSON,
    max_group_size INT,
    available_from DATE,
    available_to DATE,
    status ENUM('ACTIVE', 'INACTIVE', 'FULLY_BOOKED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_destination (destination),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tourist vehicles table
CREATE TABLE IF NOT EXISTS tourist_vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    model VARCHAR(100),
   capacity INT,
    price_per_day DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_vehicle_type (vehicle_type),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tour bookings table
CREATE TABLE IF NOT EXISTS tour_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_package_id BIGINT,
    vehicle_id BIGINT,
    user_id BIGINT NOT NULL,
   booking_date DATE NOT NULL,
    participants INT,
    total_price DECIMAL(10,2),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    special_requests TEXT,
   booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tour_package_id (tour_package_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to orders database
USE globalhub_orders;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type ENUM('PRODUCT', 'HOTEL', 'TOUR', 'PROPERTY') NOT NULL,
    items JSON,
    subtotal DECIMAL(10,2),
   tax DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    shipping_address JSON,
    billing_address JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(100) NOT NULL,
   message TEXT,
   location VARCHAR(255),
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to payments database
USE globalhub_payments;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method ENUM('CARD', 'PAYPAL', 'BANK_TRANSFER', 'WALLET') NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
   card_last_four VARCHAR(4),
   card_brand VARCHAR(50),
    failure_reason TEXT,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
   reason TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
   refunded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_id (payment_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to notifications database
USE globalhub_notifications;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('EMAIL', 'SMS', 'PUSH') NOT NULL,
    subject VARCHAR(255),
   message TEXT NOT NULL,
    status ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED') DEFAULT 'PENDING',
   sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
   read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification templates table
CREATE TABLE IF NOT EXISTS notification_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('EMAIL', 'SMS', 'PUSH') NOT NULL,
    subject VARCHAR(255),
   body TEXT NOT NULL,
    variables JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample notification templates
INSERT INTO notification_templates (name, type, subject, body, variables) VALUES
('ORDER_CONFIRMATION', 'EMAIL', 'Order Confirmation - #{orderNumber}', 'Thank you for your order! Your order #{orderNumber} has been confirmed.', '{"orderNumber": "string", "total": "number"}'),
('BOOKING_CONFIRMATION', 'EMAIL', 'Booking Confirmation', 'Your booking has been confirmed. Reference: #{bookingRef}', '{"bookingRef": "string"}'),
('PASSWORD_RESET', 'EMAIL', 'Password Reset Request', 'Click here to reset your password: #{resetLink}', '{"resetLink": "string"}'),
('WELCOME_EMAIL', 'EMAIL', 'Welcome to GlobalHub!', 'Welcome aboard! We\'re excited to have you.', '{}');

-- Grant privileges to user (optional - if you want to create a specific user)
-- CREATE USER IF NOT EXISTS 'globalhub_user'@'localhost' IDENTIFIED BY 'Password@224';
-- GRANT ALL PRIVILEGES ON globalhub_*.* TO 'globalhub_user'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'Database schema created successfully!' AS status;


-- Switch to properties database
USE globalhub_properties;

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    price DECIMAL(15,2) NOT NULL,
    price_per_month DECIMAL(15,2),
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    total_area DECIMAL(10,2),
    amenities JSON,
    images JSON,
    status ENUM('AVAILABLE', 'SOLD', 'RENTED', 'PENDING', 'INACTIVE') DEFAULT 'AVAILABLE',
    is_for_sale BOOLEAN DEFAULT TRUE,
    is_for_rent BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_city (city),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_bedrooms (bedrooms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Switch to tours database
USE globalhub_tours;

-- Tour packages table
CREATE TABLE IF NOT EXISTS tour_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255) NOT NULL,
    duration_days INT NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    max_participants INT NOT NULL,
    current_participants INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    itinerary JSON,
    inclusions JSON,
    exclusions JSON,
    images JSON,
    status ENUM('ACTIVE', 'INACTIVE', 'CANCELLED', 'COMPLETED') DEFAULT 'ACTIVE',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_destination (destination),
    INDEX idx_status (status),
    INDEX idx_price (price_per_person)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tourist vehicles table
CREATE TABLE IF NOT EXISTS tourist_vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    description TEXT,
    amenities JSON,
    images JSON,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_type (type),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tour bookings table
CREATE TABLE IF NOT EXISTS tour_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    number_of_participants INT NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tour_id (tour_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
