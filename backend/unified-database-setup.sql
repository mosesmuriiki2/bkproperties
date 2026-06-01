-- ==========================================
-- GlobalHub Unified Database Schema
-- ==========================================
-- This script creates a single database schema for all GlobalHub services
-- and consolidates all tables into one unified schema

-- Drop existing databases if they exist
DROP DATABASE IF EXISTS globalhub_auth;
DROP DATABASE IF EXISTS globalhub_users;
DROP DATABASE IF EXISTS globalhub_vendors;
DROP DATABASE IF EXISTS globalhub_products;
DROP DATABASE IF EXISTS globalhub_properties;
DROP DATABASE IF EXISTS globalhub_hotels;
DROP DATABASE IF EXISTS globalhub_tours;
DROP DATABASE IF EXISTS globalhub_orders;
DROP DATABASE IF EXISTS globalhub_payments;

-- Create unified database
CREATE DATABASE IF NOT EXISTS globalhub;
USE globalhub;

-- ==========================================
-- USERS & AUTHENTICATION TABLES
-- ==========================================

-- Users table (from auth service)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CONSUMER', 'VENDOR', 'ADMIN') NOT NULL DEFAULT 'CONSUMER',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- User profiles table (from user service)
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    profile_picture_url VARCHAR(500),
    bio TEXT,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- User addresses table (from user service)
CREATE TABLE user_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('HOME', 'WORK', 'BILLING', 'SHIPPING') NOT NULL DEFAULT 'HOME',
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'Kenya',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
);

-- ==========================================
-- VENDOR TABLES
-- ==========================================

-- Vendors table (from vendor service)
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    tax_number VARCHAR(50),
    license_number VARCHAR(50),
    property_category ENUM('HOUSE', 'LAND', 'BOTH'),
    listing_type ENUM('SALE', 'RENT', 'BOTH'),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 0.00,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    id_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vendor (user_id),
    INDEX idx_status (status),
    INDEX idx_county (county),
    INDEX idx_property_category (property_category)
);

-- Vendor documents table (from vendor service)
CREATE TABLE vendor_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    document_type ENUM('ID_COPY', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'PROPERTY_TITLE', 'OTHER') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_document_type (document_type)
);

-- ==========================================
-- PROPERTY TABLES
-- ==========================================

-- Properties table (from property service)
CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'INDUSTRIAL') NOT NULL,
    listing_type ENUM('SALE', 'RENT') NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    bedrooms INT,
    bathrooms INT,
    area_sqm DECIMAL(10,2),
    land_size_sqm DECIMAL(15,2),
    address TEXT NOT NULL,
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features JSON,
    amenities JSON,
    images JSON,
    status ENUM('DRAFT', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE') DEFAULT 'DRAFT',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_property_type (property_type),
    INDEX idx_listing_type (listing_type),
    INDEX idx_county (county),
    INDEX idx_price (price),
    INDEX idx_status (status)
);

-- ==========================================
-- PRODUCT TABLES (Cars, etc.)
-- ==========================================

-- Products table (from product service)
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('CAR', 'MOTORCYCLE', 'TRUCK', 'BUS', 'OTHER') NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    year_manufactured INT,
    condition_type ENUM('NEW', 'USED', 'REFURBISHED') NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    listing_type ENUM('SALE', 'HIRE') NOT NULL,
    specifications JSON,
    features JSON,
    images JSON,
    location VARCHAR(255),
    county VARCHAR(100),
    status ENUM('DRAFT', 'ACTIVE', 'SOLD', 'HIRED', 'INACTIVE') DEFAULT 'DRAFT',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_listing_type (listing_type),
    INDEX idx_county (county),
    INDEX idx_price (price),
    INDEX idx_status (status)
);

-- ==========================================
-- HOTEL TABLES
-- ==========================================

-- Hotels table (from hotel service)
CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('HOTEL', 'LODGE', 'RESORT', 'GUESTHOUSE', 'HOSTEL') NOT NULL,
    star_rating INT CHECK (star_rating >= 1 AND star_rating <= 5),
    address TEXT NOT NULL,
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    amenities JSON,
    images JSON,
    policies JSON,
    status ENUM('DRAFT', 'ACTIVE', 'INACTIVE') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_category (category),
    INDEX idx_county (county),
    INDEX idx_star_rating (star_rating),
    INDEX idx_status (status)
);

-- Hotel rooms table (from hotel service)
CREATE TABLE hotel_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    amenities JSON,
    images JSON,
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hotel_room (hotel_id, room_number),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status)
);

-- Hotel bookings table (from hotel service)
CREATE TABLE hotel_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    status ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED') DEFAULT 'PENDING',
    booking_reference VARCHAR(50) UNIQUE,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES hotel_rooms(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_status (status)
);

-- ==========================================
-- TOUR TABLES
-- ==========================================

-- Tour packages table (from tour service)
CREATE TABLE tour_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('SAFARI', 'CULTURAL', 'ADVENTURE', 'BEACH', 'MOUNTAIN', 'CITY', 'OTHER') NOT NULL,
    duration_days INT NOT NULL,
    max_participants INT,
    price_per_person DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    includes JSON,
    excludes JSON,
    itinerary JSON,
    images JSON,
    departure_location VARCHAR(255),
    destinations JSON,
    status ENUM('DRAFT', 'ACTIVE', 'INACTIVE') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_category (category),
    INDEX idx_duration_days (duration_days),
    INDEX idx_price_per_person (price_per_person),
    INDEX idx_status (status)
);

-- Tourist vehicles table (from tour service)
CREATE TABLE tourist_vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    vehicle_type ENUM('SAFARI_VAN', 'MINIBUS', 'COACH', '4WD', 'BOAT', 'AIRCRAFT', 'OTHER') NOT NULL,
    capacity INT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    features JSON,
    images JSON,
    location VARCHAR(255),
    status ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'INACTIVE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_vehicle_type (vehicle_type),
    INDEX idx_capacity (capacity),
    INDEX idx_status (status)
);

-- Tour bookings table (from tour service)
CREATE TABLE tour_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_package_id BIGINT,
    vehicle_id BIGINT,
    booking_type ENUM('PACKAGE', 'VEHICLE', 'CUSTOM') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    participants_count INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    booking_reference VARCHAR(50) UNIQUE,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tour_package_id) REFERENCES tour_packages(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES tourist_vehicles(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_tour_package_id (tour_package_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_start_date (start_date),
    INDEX idx_status (status)
);

-- ==========================================
-- ORDER TABLES
-- ==========================================

-- Orders table (from order service)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    order_type ENUM('PRODUCT', 'PROPERTY', 'HOTEL', 'TOUR') NOT NULL,
    reference_id BIGINT NOT NULL, -- ID of the product/property/hotel/tour
    quantity INT DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    order_reference VARCHAR(50) UNIQUE,
    shipping_address JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_order_type (order_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ==========================================
-- PAYMENT TABLES
-- ==========================================

-- Payments table (from payment service)
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    booking_id BIGINT,
    payment_type ENUM('ORDER', 'BOOKING', 'DEPOSIT', 'REFUND') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    payment_method ENUM('MPESA', 'CARD', 'BANK_TRANSFER', 'CASH', 'OTHER') NOT NULL,
    payment_reference VARCHAR(100) UNIQUE,
    external_reference VARCHAR(100),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    gateway_response JSON,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_payment_reference (payment_reference),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- ==========================================
-- SYSTEM TABLES
-- ==========================================

-- System settings table
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
);

-- ==========================================
-- INSERT INITIAL DATA
-- ==========================================

-- Insert super admin user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, is_active)
VALUES (
    'admin@globalhub.com',
    '$2b$12$2jfPBsSFBQhIgqbIOtE2GOoCsIJb1pkYBFZhuZ4pY0QsMeexFXAle',
    'Super',
    'Admin',
    '+254700000000',
    'ADMIN',
    TRUE,
    TRUE
);

-- Insert system settings for module configuration
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('modules.properties', 'true', 'Enable/disable properties module', true),
('modules.products', 'false', 'Enable/disable products module', true),
('modules.hotels', 'false', 'Enable/disable hotels module', true),
('modules.tours', 'false', 'Enable/disable tours module', true),
('system.currency', 'KSH', 'Default system currency', true),
('system.country', 'Kenya', 'Default system country', true);

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Show all tables
SHOW TABLES;

-- Verify super admin user
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE email = 'admin@globalhub.com';

-- Show system settings
SELECT * FROM system_settings;

-- Show table counts
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'hotels', COUNT(*) FROM hotels
UNION ALL
SELECT 'tour_packages', COUNT(*) FROM tour_packages
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'system_settings', COUNT(*) FROM system_settings;

COMMIT;