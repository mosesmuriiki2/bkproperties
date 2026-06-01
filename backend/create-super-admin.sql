-- Create Super Admin User
-- Password: admin123 (BCrypt hash)
-- Use this script to create the initial super admin account

USE globalhub;

-- Insert super admin user
-- Password is 'admin123' hashed with BCrypt
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at, updated_at)
VALUES (
    'admin@globalhub.com',
    '$2b$12$2jfPBsSFBQhIgqbIOtE2GOoCsIJb1pkYBFZhuZ4pY0QsMeexFXAle',  -- This is 'admin123'
    'Super',
    'Admin',
    '+254700000000',
    'ADMIN',
    TRUE,
    TRUE,
    NOW(),
    NOW()
);

-- Verify the admin was created
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE email = 'admin@globalhub.com';

-- Login credentials:
-- Email: admin@globalhub.com
-- Password: admin123

-- Verify the admin was created
SELECT id, email, first_name, last_name, role, is_active 
FROM users 
WHERE email = 'admin@globalhub.com';

-- To generate a new BCrypt hash for a different password, use:
-- https://bcrypt-generator.com/
-- Or run this in your Spring Boot application:
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hash = encoder.encode("your-password");
