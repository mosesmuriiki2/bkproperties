-- Create New Super Admin User
-- Email: superadmin@gmail.com
-- Password: admin@123
-- Date: April 30, 2026

USE globalhub;

-- Insert super admin user
-- Note: Password should be hashed in production. Using plain text for development only.
INSERT INTO users (email, password, first_name, last_name, phone, role, enabled, created_at, updated_at)
VALUES (
    'superadmin@gmail.com',
    '$2a$10$YourHashedPasswordHere', -- This will be replaced by BCrypt hash
    'Super',
    'Admin',
    '+254700000000',
    'ADMIN',
    1,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    password = '$2a$10$YourHashedPasswordHere',
    role = 'ADMIN',
    enabled = 1,
    updated_at = NOW();

-- Verify the user was created
SELECT id, email, first_name, last_name, role, enabled, created_at
FROM users
WHERE email = 'superadmin@gmail.com';

-- Note: The password 'admin@123' needs to be hashed using BCrypt
-- You can use the auth service to register this user or hash it manually
