# Complete User Flow Guide - Property Marketplace

## Overview

This guide explains the complete user registration, login, and property management flow for all user types in the GlobalHub Property Marketplace.

## User Types

### 1. **Normal Users (CONSUMER)**
- Can browse properties
- Can search and filter listings
- Can contact property owners
- Can save favorite properties

### 2. **Property Owners (VENDOR)**
- Can list properties (houses/land)
- Can manage their listings
- Can view inquiries
- Can track analytics

### 3. **Super Admin (ADMIN)**
- Can view all users and vendors
- Can approve/reject vendor applications
- Can manage all properties
- Can view system analytics
- Full system access

## Registration & Login Flows

### A. Normal User Registration

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254700000000",
  "role": "CONSUMER"
}
```

**Response:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CONSUMER",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User registered successfully"
}
```

**Frontend Flow:**
1. User fills registration form at `/Register`
2. System creates user account with CONSUMER role
3. User receives JWT tokens
4. User is redirected to consumer dashboard

### B. Property Owner (Vendor) Registration

**Two-Step Process:**

#### Step 1: Create User Account
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "12345678",  // Uses ID number as password
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+254711111111",
  "role": "VENDOR",
  // Property-specific fields
  "businessName": "Nairobi Properties Ltd",
  "businessType": "company",
  "taxNumber": "A000000000A",
  "licenseNumber": "BL/2024/12345",
  "propertyCategory": "BOTH",
  "listingType": "SALE",
  "county": "Nairobi",
  "subCounty": "Westlands",
  "address": "123 Main Street, Nairobi",
  "website": "https://example.com",
  "description": "Leading property agency in Nairobi",
  "idNumber": "12345678"
}
```

**Response:**
```json
{
  "userId": 2,
  "email": "owner@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "VENDOR",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User registered successfully"
}
```

#### Step 2: Create Vendor Profile
**Endpoint:** `POST /api/vendors/register`

**Request:**
```json
{
  "userId": 2,  // From Step 1 response
  "businessName": "Nairobi Properties Ltd",
  "businessType": "company",
  "taxNumber": "A000000000A",
  "licenseNumber": "BL/2024/12345",
  "propertyCategory": "BOTH",
  "listingType": "SALE",
  "email": "owner@example.com",
  "phone": "+254711111111",
  "address": "123 Main Street, Nairobi",
  "county": "Nairobi",
  "subCounty": "Westlands",
  "website": "https://example.com",
  "description": "Leading property agency in Nairobi",
  "idNumber": "12345678"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 2,
  "businessName": "Nairobi Properties Ltd",
  "businessType": "company",
  "propertyCategory": "BOTH",
  "listingType": "SALE",
  "status": "PENDING",
  "rating": 0.0,
  "email": "owner@example.com",
  "phone": "+254711111111",
  "county": "Nairobi",
  "subCounty": "Westlands",
  "address": "123 Main Street, Nairobi",
  "createdAt": "2026-04-29T10:00:00",
  "updatedAt": "2026-04-29T10:00:00"
}
```

**Frontend Flow:**
1. User fills comprehensive vendor application form at `/VendorPortal`
2. System creates user account with VENDOR role
3. System creates vendor profile linked to user
4. Vendor receives confirmation with login credentials
5. Vendor status is set to PENDING (awaits admin approval)

### C. Admin Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@globalhub.com",
  "password": "adminPassword123"
}
```

**Response:**
```json
{
  "userId": 3,
  "email": "admin@globalhub.com",
  "firstName": "Super",
  "lastName": "Admin",
  "role": "ADMIN",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Login successful"
}
```

**Frontend Flow:**
1. Admin logs in at `/AdminLogin`
2. System validates credentials
3. Admin is redirected to admin dashboard
4. Admin can view and manage all system data

## Login Flow (All Users)

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CONSUMER|VENDOR|ADMIN",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Login successful"
}
```

**Frontend Routing After Login:**
- **CONSUMER** → `/ConsumerDashboard`
- **VENDOR** → `/VendorDashboard`
- **ADMIN** → `/AdminDashboard`

## Property Management (Vendors)

### 1. List a Property

**Endpoint:** `POST /api/properties`

**Request:**
```json
{
  "vendorId": 1,
  "title": "4 Bedroom Villa in Karen",
  "description": "Luxurious villa with modern amenities",
  "propertyType": "HOUSE",
  "listingType": "SALE",
  "price": 45000000,  // KSh 45M
  "currency": "KSH",
  "bedrooms": 4,
  "bathrooms": 3,
  "size": 350,  // square meters
  "county": "Nairobi",
  "subCounty": "Karen",
  "address": "Karen Road, Nairobi",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "features": ["Swimming Pool", "Garden", "Parking", "Security"],
  "status": "AVAILABLE"
}
```

### 2. Upload Property Images

**Endpoint:** `POST /api/properties/{propertyId}/images`

**Request:** `multipart/form-data`
- `file`: Image file (JPEG/PNG, max 10MB)

**Response:**
```json
{
  "id": 1,
  "propertyId": 1,
  "imageUrl": "/uploads/properties/property-1-image-1.jpg",
  "isPrimary": true,
  "uploadedAt": "2026-04-29T10:00:00"
}
```

### 3. View Own Listings

**Endpoint:** `GET /api/vendors/{vendorId}/properties`

**Response:**
```json
[
  {
    "id": 1,
    "title": "4 Bedroom Villa in Karen",
    "price": 45000000,
    "currency": "KSH",
    "status": "AVAILABLE",
    "views": 245,
    "inquiries": 12,
    "createdAt": "2026-04-29T10:00:00"
  }
]
```

## Admin Functions

### 1. View All Vendors

**Endpoint:** `GET /api/vendors`

**Response:**
```json
[
  {
    "id": 1,
    "businessName": "Nairobi Properties Ltd",
    "email": "owner@example.com",
    "status": "PENDING",
    "propertyCategory": "BOTH",
    "listingType": "SALE",
    "createdAt": "2026-04-29T10:00:00"
  }
]
```

### 2. Approve/Reject Vendor

**Endpoint:** `PUT /api/vendors/{vendorId}/status`

**Request:**
```json
{
  "status": "APPROVED"  // or "REJECTED"
}
```

### 3. View All Properties

**Endpoint:** `GET /api/properties`

**Query Parameters:**
- `status`: AVAILABLE, SOLD, RENTED
- `county`: Filter by county
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

## Property Search (Public)

**Endpoint:** `GET /api/properties/search`

**Query Parameters:**
- `q`: Search keyword
- `county`: County filter
- `propertyType`: HOUSE, LAND, APARTMENT
- `listingType`: SALE, RENT
- `minPrice`: Minimum price (KSh)
- `maxPrice`: Maximum price (KSh)
- `bedrooms`: Number of bedrooms
- `page`: Page number
- `size`: Results per page

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "4 Bedroom Villa in Karen",
      "price": 45000000,
      "currency": "KSH",
      "county": "Nairobi",
      "subCounty": "Karen",
      "bedrooms": 4,
      "bathrooms": 3,
      "size": 350,
      "images": [
        {
          "imageUrl": "/uploads/properties/property-1-image-1.jpg",
          "isPrimary": true
        }
      ],
      "vendor": {
        "businessName": "Nairobi Properties Ltd",
        "rating": 4.8
      }
    }
  ],
  "totalElements": 150,
  "totalPages": 15,
  "number": 0,
  "size": 10
}
```

## Authentication Flow

### Token Management

**Access Token:**
- Expires in 1 hour
- Used for API requests
- Stored in localStorage as `accessToken`

**Refresh Token:**
- Expires in 7 days
- Used to get new access token
- Stored in localStorage as `refreshToken`

### Token Refresh

**Endpoint:** `POST /api/auth/refresh?refreshToken={token}`

**Response:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "CONSUMER",
  "accessToken": "newAccessToken...",
  "refreshToken": "sameRefreshToken...",
  "message": "Token refreshed successfully"
}
```

### Token Validation

**Endpoint:** `POST /api/auth/validate?token={token}`

**Response:**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "CONSUMER",
  "message": "Token is valid"
}
```

## Frontend Routes

### Public Routes
- `/` - Home page
- `/Properties` - Browse properties
- `/Land` - Browse land listings
- `/About` - About page
- `/Login` - User login
- `/Register` - User registration
- `/VendorPortal` - Vendor application

### Protected Routes (Require Login)

**Consumer:**
- `/ConsumerDashboard` - User dashboard
- `/Properties/{id}` - Property details
- `/favorites` - Saved properties

**Vendor:**
- `/VendorDashboard` - Vendor dashboard
- `/VendorDashboard/properties` - Manage listings
- `/VendorDashboard/add-property` - Add new property
- `/VendorDashboard/analytics` - View analytics

**Admin:**
- `/AdminDashboard` - Admin dashboard
- `/AdminDashboard/vendors` - Manage vendors
- `/AdminDashboard/properties` - Manage properties
- `/AdminDashboard/users` - Manage users
- `/AdminDashboard/analytics` - System analytics

## Database Schema

### users table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('CONSUMER', 'VENDOR', 'ADMIN') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### vendors table
```sql
CREATE TABLE vendors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(50),
  tax_number VARCHAR(100),
  license_number VARCHAR(100),
  property_category ENUM('HOUSE', 'LAND', 'BOTH'),
  listing_type ENUM('SALE', 'RENT', 'BOTH'),
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING',
  rating DECIMAL(3,2) DEFAULT 0.00,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  county VARCHAR(100),
  sub_county VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  id_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### properties table
```sql
CREATE TABLE properties (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vendor_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type ENUM('HOUSE', 'LAND', 'APARTMENT', 'COMMERCIAL'),
  listing_type ENUM('SALE', 'RENT'),
  price DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KSH',
  bedrooms INT,
  bathrooms INT,
  size DECIMAL(10,2),
  county VARCHAR(100),
  sub_county VARCHAR(100),
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  features JSON,
  status ENUM('AVAILABLE', 'SOLD', 'RENTED', 'PENDING') DEFAULT 'AVAILABLE',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

### property_images table
```sql
CREATE TABLE property_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  property_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
```

## Testing the Complete Flow

### 1. Register as Property Owner
```bash
curl -X POST http://localhost:9096/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "12345678",
    "firstName": "Test",
    "lastName": "Owner",
    "phone": "+254700000000",
    "role": "VENDOR",
    "businessName": "Test Properties",
    "businessType": "individual",
    "propertyCategory": "BOTH",
    "listingType": "SALE",
    "county": "Nairobi",
    "address": "Test Address",
    "idNumber": "12345678"
  }'
```

### 2. Create Vendor Profile
```bash
curl -X POST http://localhost:9096/api/vendors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "userId": 1,
    "businessName": "Test Properties",
    "businessType": "individual",
    "propertyCategory": "BOTH",
    "listingType": "SALE",
    "email": "owner@test.com",
    "phone": "+254700000000",
    "address": "Test Address",
    "county": "Nairobi",
    "idNumber": "12345678"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:9096/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "12345678"
  }'
```

## Security Notes

1. **Passwords**: Hashed using BCrypt
2. **JWT Tokens**: Signed with HS256 algorithm
3. **CORS**: Configured for localhost:5173
4. **CSRF**: Disabled for REST API
5. **File Uploads**: Validated (type, size)
6. **SQL Injection**: Protected by JPA/Hibernate

## Next Steps

1. ✅ User registration and login working
2. ✅ Vendor registration with property fields
3. ✅ Role-based authentication
4. 🔄 Property listing creation (implement next)
5. 🔄 Image upload for properties
6. 🔄 Property search and filtering
7. 🔄 Admin approval workflow
8. 🔄 Vendor dashboard
9. 🔄 Property details page
10. 🔄 Contact owner functionality

---

**Status:** Registration and Login Complete ✅
**Date:** April 29, 2026
**Version:** 1.0.0
