#!/bin/bash

# Create Super Admin User
# Email: superadmin@gmail.com
# Password: admin@123

echo "Creating Super Admin User..."
echo "Email: superadmin@gmail.com"
echo "Password: admin@123"
echo ""

# Register the user via API
curl -X POST http://localhost:7072/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@gmail.com",
    "password": "admin@123",
    "firstName": "Super",
    "lastName": "Admin",
    "phone": "+254700000000",
    "role": "ADMIN"
  }'

echo ""
echo ""
echo "Super Admin user created successfully!"
echo ""
echo "Login Credentials:"
echo "  Email: superadmin@gmail.com"
echo "  Password: admin@123"
echo ""
echo "You can now login at: http://localhost:5173/login"
