-- ==========================================
-- Migration Script: Move to Unified Database
-- ==========================================
-- This script migrates existing data from separate databases to the unified globalhub schema

-- First, run the unified database setup
SOURCE unified-database-setup.sql;

-- ==========================================
-- MIGRATE EXISTING DATA
-- ==========================================

-- Migrate users from globalhub_auth if it exists
INSERT IGNORE INTO globalhub.users (id, email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at, updated_at)
SELECT id, email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at, updated_at
FROM globalhub_auth.users
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_auth');

-- Migrate vendors from globalhub_vendors if it exists
INSERT IGNORE INTO globalhub.vendors (id, user_id, business_name, business_type, tax_number, license_number, property_category, listing_type, status, rating, email, phone, address, county, sub_county, website, description, id_number, created_at, updated_at)
SELECT id, user_id, business_name, business_type, tax_number, license_number, property_category, listing_type, status, rating, email, phone, address, county, sub_county, website, description, id_number, created_at, updated_at
FROM globalhub_vendors.vendors
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_vendors');

-- Migrate vendor documents from globalhub_vendors if it exists
INSERT IGNORE INTO globalhub.vendor_documents (id, vendor_id, document_type, document_name, file_path, file_size, mime_type, uploaded_at)
SELECT id, vendor_id, document_type, document_name, file_path, file_size, mime_type, uploaded_at
FROM globalhub_vendors.vendor_documents
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_vendors');

-- Migrate user profiles from globalhub_users if it exists
INSERT IGNORE INTO globalhub.user_profiles (id, user_id, date_of_birth, gender, profile_picture_url, bio, preferences, created_at, updated_at)
SELECT id, user_id, date_of_birth, gender, profile_picture_url, bio, preferences, created_at, updated_at
FROM globalhub_users.user_profiles
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_users');

-- Migrate user addresses from globalhub_users if it exists
INSERT IGNORE INTO globalhub.user_addresses (id, user_id, type, street_address, city, state_province, postal_code, country, is_default, created_at, updated_at)
SELECT id, user_id, type, street_address, city, state_province, postal_code, country, is_default, created_at, updated_at
FROM globalhub_users.user_addresses
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_users');

-- Migrate properties from globalhub_properties if it exists
INSERT IGNORE INTO globalhub.properties (id, vendor_id, title, description, property_type, listing_type, price, currency, bedrooms, bathrooms, area_sqm, land_size_sqm, address, county, sub_county, latitude, longitude, features, amenities, images, status, views_count, created_at, updated_at)
SELECT id, vendor_id, title, description, property_type, listing_type, price, currency, bedrooms, bathrooms, area_sqm, land_size_sqm, address, county, sub_county, latitude, longitude, features, amenities, images, status, views_count, created_at, updated_at
FROM globalhub_properties.properties
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_properties');

-- Migrate products from globalhub_products if it exists
INSERT IGNORE INTO globalhub.products (id, vendor_id, name, description, category, subcategory, brand, model, year_manufactured, condition_type, price, currency, listing_type, specifications, features, images, location, county, status, views_count, created_at, updated_at)
SELECT id, vendor_id, name, description, category, subcategory, brand, model, year_manufactured, condition_type, price, currency, listing_type, specifications, features, images, location, county, status, views_count, created_at, updated_at
FROM globalhub_products.products
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_products');

-- Migrate hotels from globalhub_hotels if it exists
INSERT IGNORE INTO globalhub.hotels (id, vendor_id, name, description, category, star_rating, address, county, sub_county, latitude, longitude, phone, email, website, amenities, images, policies, status, created_at, updated_at)
SELECT id, vendor_id, name, description, category, star_rating, address, county, sub_county, latitude, longitude, phone, email, website, amenities, images, policies, status, created_at, updated_at
FROM globalhub_hotels.hotels
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_hotels');

-- Migrate hotel rooms from globalhub_hotels if it exists
INSERT IGNORE INTO globalhub.hotel_rooms (id, hotel_id, room_number, room_type, description, capacity, price_per_night, currency, amenities, images, status, created_at, updated_at)
SELECT id, hotel_id, room_number, room_type, description, capacity, price_per_night, currency, amenities, images, status, created_at, updated_at
FROM globalhub_hotels.hotel_rooms
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_hotels');

-- Migrate hotel bookings from globalhub_hotels if it exists
INSERT IGNORE INTO globalhub.hotel_bookings (id, user_id, hotel_id, room_id, check_in_date, check_out_date, guests_count, total_amount, currency, status, booking_reference, special_requests, created_at, updated_at)
SELECT id, user_id, hotel_id, room_id, check_in_date, check_out_date, guests_count, total_amount, currency, status, booking_reference, special_requests, created_at, updated_at
FROM globalhub_hotels.hotel_bookings
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_hotels');

-- Migrate tour packages from globalhub_tours if it exists
INSERT IGNORE INTO globalhub.tour_packages (id, vendor_id, name, description, category, duration_days, max_participants, price_per_person, currency, includes, excludes, itinerary, images, departure_location, destinations, status, created_at, updated_at)
SELECT id, vendor_id, name, description, category, duration_days, max_participants, price_per_person, currency, includes, excludes, itinerary, images, departure_location, destinations, status, created_at, updated_at
FROM globalhub_tours.tour_packages
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_tours');

-- Migrate tourist vehicles from globalhub_tours if it exists
INSERT IGNORE INTO globalhub.tourist_vehicles (id, vendor_id, name, vehicle_type, capacity, price_per_day, currency, features, images, location, status, created_at, updated_at)
SELECT id, vendor_id, name, vehicle_type, capacity, price_per_day, currency, features, images, location, status, created_at, updated_at
FROM globalhub_tours.tourist_vehicles
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_tours');

-- Migrate tour bookings from globalhub_tours if it exists
INSERT IGNORE INTO globalhub.tour_bookings (id, user_id, tour_package_id, vehicle_id, booking_type, start_date, end_date, participants_count, total_amount, currency, status, booking_reference, special_requests, created_at, updated_at)
SELECT id, user_id, tour_package_id, vehicle_id, booking_type, start_date, end_date, participants_count, total_amount, currency, status, booking_reference, special_requests, created_at, updated_at
FROM globalhub_tours.tour_bookings
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_tours');

-- Migrate orders from globalhub_orders if it exists
INSERT IGNORE INTO globalhub.orders (id, user_id, vendor_id, order_type, reference_id, quantity, unit_price, total_amount, currency, status, order_reference, shipping_address, notes, created_at, updated_at)
SELECT id, user_id, vendor_id, order_type, reference_id, quantity, unit_price, total_amount, currency, status, order_reference, shipping_address, notes, created_at, updated_at
FROM globalhub_orders.orders
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_orders');

-- Migrate payments from globalhub_payments if it exists
INSERT IGNORE INTO globalhub.payments (id, user_id, order_id, booking_id, payment_type, amount, currency, payment_method, payment_reference, external_reference, status, gateway_response, processed_at, created_at, updated_at)
SELECT id, user_id, order_id, booking_id, payment_type, amount, currency, payment_method, payment_reference, external_reference, status, gateway_response, processed_at, created_at, updated_at
FROM globalhub_payments.payments
WHERE EXISTS (SELECT 1 FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'globalhub_payments');

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Show migration results
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM globalhub.users
UNION ALL
SELECT 'vendors', COUNT(*) FROM globalhub.vendors
UNION ALL
SELECT 'vendor_documents', COUNT(*) FROM globalhub.vendor_documents
UNION ALL
SELECT 'user_profiles', COUNT(*) FROM globalhub.user_profiles
UNION ALL
SELECT 'user_addresses', COUNT(*) FROM globalhub.user_addresses
UNION ALL
SELECT 'properties', COUNT(*) FROM globalhub.properties
UNION ALL
SELECT 'products', COUNT(*) FROM globalhub.products
UNION ALL
SELECT 'hotels', COUNT(*) FROM globalhub.hotels
UNION ALL
SELECT 'hotel_rooms', COUNT(*) FROM globalhub.hotel_rooms
UNION ALL
SELECT 'hotel_bookings', COUNT(*) FROM globalhub.hotel_bookings
UNION ALL
SELECT 'tour_packages', COUNT(*) FROM globalhub.tour_packages
UNION ALL
SELECT 'tourist_vehicles', COUNT(*) FROM globalhub.tourist_vehicles
UNION ALL
SELECT 'tour_bookings', COUNT(*) FROM globalhub.tour_bookings
UNION ALL
SELECT 'orders', COUNT(*) FROM globalhub.orders
UNION ALL
SELECT 'payments', COUNT(*) FROM globalhub.payments
UNION ALL
SELECT 'system_settings', COUNT(*) FROM globalhub.system_settings;

-- Verify super admin exists
SELECT id, email, first_name, last_name, role, is_active 
FROM globalhub.users 
WHERE email = 'admin@globalhub.com';

COMMIT;

-- ==========================================
-- CLEANUP (OPTIONAL - UNCOMMENT TO REMOVE OLD DATABASES)
-- ==========================================
-- WARNING: This will permanently delete the old databases!
-- Only run this after verifying the migration was successful

-- DROP DATABASE IF EXISTS globalhub_auth;
-- DROP DATABASE IF EXISTS globalhub_users;
-- DROP DATABASE IF EXISTS globalhub_vendors;
-- DROP DATABASE IF EXISTS globalhub_products;
-- DROP DATABASE IF EXISTS globalhub_properties;
-- DROP DATABASE IF EXISTS globalhub_hotels;
-- DROP DATABASE IF EXISTS globalhub_tours;
-- DROP DATABASE IF EXISTS globalhub_orders;
-- DROP DATABASE IF EXISTS globalhub_payments;