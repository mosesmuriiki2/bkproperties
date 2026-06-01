-- Booking Calendar System Tables
-- Run this SQL to add booking and availability features

USE globalhub;

-- Vendor Availability Table
CREATE TABLE IF NOT EXISTS vendor_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_bookings INT NOT NULL DEFAULT 1,
    current_bookings INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    notes VARCHAR(500),
    INDEX idx_vendor_date (vendor_id, available_date),
    INDEX idx_property_date (property_id, available_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Property Bookings Table
CREATE TABLE IF NOT EXISTS property_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    booking_type VARCHAR(20) NOT NULL DEFAULT 'VIEWING',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason VARCHAR(500),
    vendor_notified BOOLEAN NOT NULL DEFAULT FALSE,
    customer_notified BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_vendor (vendor_id),
    INDEX idx_customer (customer_id),
    INDEX idx_property (property_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status),
    INDEX idx_vendor_notified (vendor_id, vendor_notified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample availability data for testing
INSERT INTO vendor_availability (vendor_id, property_id, available_date, start_time, end_time, max_bookings, current_bookings, status, notes)
VALUES 
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '10:00:00', 2, 0, 'AVAILABLE', 'Morning slot'),
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '15:00:00', 2, 0, 'AVAILABLE', 'Afternoon slot'),
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '11:00:00', 1, 0, 'AVAILABLE', 'Single viewing'),
    (1, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '17:00:00', 5, 0, 'AVAILABLE', 'Open house day'),
    (1, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '12:00:00', 1, 0, 'AVAILABLE', 'Property inspection'),
    (1, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00:00', '16:00:00', 1, 0, 'AVAILABLE', 'Site visit');

SELECT 'Booking calendar tables created successfully!' AS Status;
