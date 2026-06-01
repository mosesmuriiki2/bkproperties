-- Direct SQL Insert for Super Admin
-- Email: superadmin@gmail.com
-- Password: admin@123
-- BCrypt Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- Date: April 30, 2026

USE globalhub;

-- Delete existing user if exists (to avoid duplicates)
DELETE FROM users WHERE email = 'superadmin@gmail.com';

-- Insert super admin user with BCrypt hashed password
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone, 
    role, 
    is_verified,
    is_active, 
    created_at, 
    updated_at
)
VALUES (
    'superadmin@gmail.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- BCrypt hash for 'admin@123'
    'Super',
    'Admin',
    '+254700000000',
    'ADMIN',
    1,
    1,
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    is_verified,
    is_active, 
    created_at
FROM users
WHERE email = 'superadmin@gmail.com';

-- Display success message
SELECT 'Super Admin user created successfully!' AS Status;
SELECT 'Email: superadmin@gmail.com' AS Credentials;
SELECT 'Password: admin@123' AS Password;
