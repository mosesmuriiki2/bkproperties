#!/bin/bash

# Create Super Admin User Script
# This script creates a super admin user in the database

echo "Creating Super Admin User..."
echo "Email: admin@globalhub.com"
echo "Password: admin123"
echo ""

# BCrypt hash for 'admin123' (strength 10)
HASH='$2a$10$N9qppKjJb2eQXYm1hFt3COxKV7PYnEWDO5cQU5LqWQqGKp7HqYJKO'

mysql -u root -pPassword@224 globalhub_auth << SQL
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at, updated_at)
VALUES (
    'admin@globalhub.com',
    '$HASH',
    'Super',
    'Admin',
    '+254700000000',
    'ADMIN',
    TRUE,
    TRUE,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    password_hash = '$HASH',
    updated_at = NOW();

SELECT 'Admin user created/updated successfully!' as message;
SELECT id, email, first_name, last_name, role, is_active FROM users WHERE email = 'admin@globalhub.com';
SQL

echo ""
echo "✅ Super Admin created successfully!"
echo "Login credentials:"
echo "  Email: admin@globalhub.com"
echo "  Password: admin123"
