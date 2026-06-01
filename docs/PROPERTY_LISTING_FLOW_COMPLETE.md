# Property Listing Flow - Complete Implementation

## Date: April 30, 2026

---

## 🎯 Overview

Complete end-to-end property listing flow with vendor registration, document uploads, OTP authentication, and admin approval workflow.

---

## 📋 Complete User Flow

### 1. Property Submission (Vendor Registration)

**Page**: `/list-property` (ListProperty.jsx)

**Step 1: Vendor Information**
- Personal details (name, email, phone, ID number)
- Business information (business name, type, tax number, license)
- Property category (HOUSE, LAND, BOTH)
- Listing type (SALE, RENT, BOTH)
- Location (county, sub-county, address)
- Document uploads (ID/Passport required, Business License optional)

**Step 2: Property Details**
- Property title and description
- Property type (HOUSE, APARTMENT, LAND, COMMERCIAL)
- Listing type (SALE, RENT)
- Price in KSh
- Bedrooms, bathrooms, area
- Property images (multiple upload)

**Backend Process**:
1. Creates user account with VENDOR role
2. Creates vendor profile linked to user
3. Uploads documents to `/uploads/vendor-documents/`
4. Creates property listing with DRAFT status
5. Uploads property images

**Result**: Vendor receives confirmation with instructions to login via OTP

---

### 2. Vendor Login with OTP

**Page**: `/vendor-login` (VendorLogin.jsx)

**Process**:
1. Vendor enters email address
2. System sends 6-digit OTP to email
3. Vendor enters OTP
4. System verifies OTP and logs in vendor
5. Redirects to Vendor Dashboard

**Backend Endpoints**:
- `POST /api/auth/send-otp` - Sends OTP to email
- `POST /api/auth/verify-otp` - Verifies OTP and returns JWT tokens

**OTP Details**:
- 6-digit numeric code
- Logged in console for development
- Valid for 10 minutes
- Removed after successful verification

---

### 3. Vendor Dashboard

**Page**: `/VendorDashboard` (VendorDashboard.jsx)

**Features**:
- View all property listings
- See listing status (DRAFT, PENDING, ACTIVE, INACTIVE)
- Track approval progress
- View statistics (views, bookings)
- Add new properties
- Edit existing properties
- View notifications

**Property Status Flow**:
- **DRAFT**: Just submitted, awaiting admin review
- **PENDING**: Under admin review
- **ACTIVE**: Approved and visible to users
- **INACTIVE**: Rejected or suspended

---

### 4. Admin Approval Workflow

**Page**: `/AdminDashboard` (AdminDashboard.jsx)

**Admin Actions**:

**Property Management**:
- View all pending properties
- See property details (title, description, price, location, images)
- Approve property → Status changes to ACTIVE
- Reject property with reason → Status changes to INACTIVE
- View vendor information

**Vendor Management**:
- View all vendors
- See vendor details (business name, contact, documents)
- Approve vendor → Status changes to APPROVED
- Reject vendor with reason → Status changes to REJECTED
- View uploaded documents (ID, business license)

**Backend Endpoints**:
- `GET /api/properties/pending` - Get pending properties
- `PUT /api/properties/{id}/approve` - Approve property
- `PUT /api/properties/{id}/reject?reason=...` - Reject property
- `GET /api/vendors` - Get all vendors
- `PUT /api/vendors/{id}/approve` - Approve vendor
- `PUT /api/vendors/{id}/reject?reason=...` - Reject vendor

---

### 5. Public Listing Display

**Pages**: `/`, `/properties`, `/search`

**Features**:
- Only ACTIVE properties are shown
- Users can search and filter properties
- View property details
- Contact vendor
- Book property tours

---

## 🔧 Technical Implementation

### Frontend Components

**New Pages**:
1. `src/pages/ListProperty.jsx` - Combined vendor registration and property listing
2. `src/pages/VendorLogin.jsx` - OTP-based vendor login
3. Updated `src/pages/VendorDashboard.jsx` - Shows listing status
4. Updated `src/pages/AdminDashboard.jsx` - Property and vendor approval

**API Client Updates** (`src/api/apiClient.js`):
```javascript
// OTP Authentication
api.auth.sendOTP(email)
api.auth.verifyOTP(email, otp)

// Property Management
api.properties.create(propertyData, images)
api.properties.getByVendor(vendorId)

// Vendor Management
api.vendors.register(vendorData)
```

### Backend Services

**Auth Service** (`globalhub-auth-service`):
- `POST /api/auth/send-otp` - Generate and send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- OTP stored in-memory (use Redis in production)
- OTP logged to console for development

**Vendor Service** (`globalhub-vendor-service`):
- `POST /api/vendors/register` - Register new vendor
- `POST /api/vendors/{id}/documents/upload` - Upload documents
- `PUT /api/vendors/{id}/approve` - Approve vendor
- `PUT /api/vendors/{id}/reject` - Reject vendor
- Documents stored in `/uploads/vendor-documents/`

**Property Service** (`globalhub-property-service`):
- `POST /api/properties` - Create property with images
- `GET /api/properties/vendor/{vendorId}` - Get vendor properties
- `GET /api/properties/pending` - Get pending properties
- `PUT /api/properties/{id}/approve` - Approve property
- `PUT /api/properties/{id}/reject` - Reject property
- Images stored in `/uploads/property-images/`

---

## 📁 File Upload Structure

```
uploads/
├── vendor-documents/
│   ├── {vendorId}_id_{uuid}.jpg
│   ├── {vendorId}_license_{uuid}.pdf
│   └── ...
└── property-images/
    ├── {propertyId}_1_{uuid}.jpg
    ├── {propertyId}_2_{uuid}.jpg
    └── ...
```

---

## 🔐 Security & Authentication

### User Roles
- **CONSUMER**: Regular users browsing properties
- **VENDOR**: Property owners listing properties
- **ADMIN**: Super admin managing approvals

### Authentication Flow
1. **Regular Login**: Email + Password → JWT tokens
2. **OTP Login**: Email → OTP → JWT tokens
3. **Token Storage**: localStorage (accessToken, user info)
4. **Session Storage**: Role-specific session data

### Authorization
- Vendors can only see/edit their own properties
- Admins can see/manage all properties and vendors
- Consumers can only view ACTIVE properties

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('CONSUMER', 'VENDOR', 'ADMIN'),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vendors Table
```sql
CREATE TABLE vendors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    property_category ENUM('HOUSE', 'LAND', 'BOTH'),
    listing_type ENUM('SALE', 'RENT', 'BOTH'),
    tax_number VARCHAR(50),
    license_number VARCHAR(50),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    county VARCHAR(100),
    sub_county VARCHAR(100),
    id_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Vendor Documents Table
```sql
CREATE TABLE vendor_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor_id BIGINT NOT NULL,
    document_type VARCHAR(50),
    document_url VARCHAR(500),
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL'),
    listing_type ENUM('SALE', 'RENT'),
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KSH',
    bedrooms INT,
    bathrooms INT,
    area_sqm DECIMAL(10,2),
    land_size_sqm DECIMAL(15,2),
    address TEXT NOT NULL,
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    features JSON,
    amenities JSON,
    images JSON,
    status ENUM('DRAFT', 'PENDING', 'ACTIVE', 'INACTIVE') DEFAULT 'DRAFT',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

---

## 🚀 Testing the Flow

### 1. Submit Property Listing
```bash
# Navigate to listing page
http://localhost:5173/list-property

# Fill in vendor information
# Upload ID document (required)
# Upload business license (optional)
# Continue to property details
# Fill in property information
# Upload property images
# Submit
```

### 2. Check OTP in Logs
```bash
# Check auth service logs for OTP
tail -f backend/globalhub-auth-service/logs/application.log

# Look for:
# OTP for vendor@example.com: 123456
```

### 3. Login as Vendor
```bash
# Navigate to vendor login
http://localhost:5173/vendor-login

# Enter email
# Check logs for OTP
# Enter OTP
# Login successful → Redirects to dashboard
```

### 4. View Listing Status
```bash
# Vendor dashboard shows:
# - Property title
# - Status: DRAFT
# - Awaiting admin approval
```

### 5. Admin Approval
```bash
# Login as admin
http://localhost:5173/login
# Email: superadmin@gmail.com
# Password: admin@123

# Navigate to Property Management
# See pending property
# Click "Approve" or "Reject"
```

### 6. Verify Listing is Live
```bash
# Navigate to home page
http://localhost:5173/

# Approved property now visible
# Users can search and view
```

---

## 📝 API Testing

### Send OTP
```bash
curl -X POST http://localhost:7072/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@example.com"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:7072/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@example.com", "otp": "123456"}'
```

### Get Vendor Properties
```bash
curl -X GET http://localhost:8083/api/properties/vendor/1 \
  -H "Authorization: Bearer {token}"
```

### Approve Property
```bash
curl -X PUT http://localhost:8083/api/properties/1/approve \
  -H "Authorization: Bearer {admin_token}"
```

---

## ✅ Features Implemented

### Vendor Registration
- [x] Combined vendor and property submission
- [x] Document upload (ID/Passport, Business License)
- [x] Dynamic county/sub-county selection
- [x] File storage in uploads folder
- [x] Vendor status tracking (PENDING, APPROVED, REJECTED)

### OTP Authentication
- [x] OTP generation (6-digit)
- [x] OTP sending (logged to console)
- [x] OTP verification
- [x] JWT token generation after OTP verification
- [x] Vendor login page with OTP flow

### Vendor Dashboard
- [x] View all properties
- [x] See listing status
- [x] Track approval progress
- [x] Add new properties
- [x] View statistics

### Admin Dashboard
- [x] View pending properties
- [x] Approve/reject properties
- [x] View vendor details
- [x] Approve/reject vendors
- [x] View uploaded documents
- [x] Dashboard statistics

### Public Listings
- [x] Only ACTIVE properties shown
- [x] Search and filter
- [x] Property details page
- [x] Contact vendor

---

## 🔄 Status Flow Diagram

```
User Submits Listing
        ↓
Creates User Account (VENDOR role)
        ↓
Creates Vendor Profile (PENDING status)
        ↓
Uploads Documents → /uploads/vendor-documents/
        ↓
Creates Property (DRAFT status)
        ↓
Uploads Images → /uploads/property-images/
        ↓
Vendor Receives OTP via Email
        ↓
Vendor Logs In with OTP
        ↓
Vendor Sees Dashboard (Status: DRAFT)
        ↓
Admin Reviews Property
        ↓
    ┌───┴───┐
    ↓       ↓
APPROVE  REJECT
    ↓       ↓
ACTIVE  INACTIVE
    ↓       
Visible to Users
```

---

## 🎯 Next Steps

### Production Enhancements
1. **Email Service Integration**
   - Send OTP via email (currently logged)
   - Send approval/rejection notifications
   - Send welcome emails

2. **Redis for OTP Storage**
   - Replace in-memory OTP storage
   - Add expiry (10 minutes)
   - Handle distributed systems

3. **File Upload Improvements**
   - Add file size validation
   - Add file type validation
   - Implement cloud storage (S3, Cloudinary)
   - Generate thumbnails for images

4. **Enhanced Security**
   - Rate limiting on OTP requests
   - CAPTCHA on registration
   - Document verification workflow
   - Audit logging

5. **Notifications**
   - Real-time notifications
   - Email notifications
   - SMS notifications
   - Push notifications

---

## 📞 Support

### For Vendors
- Login issues: Check OTP in email/logs
- Listing not showing: Check status in dashboard
- Document upload: Ensure file size < 5MB

### For Admins
- Approval workflow: Property Management section
- Vendor verification: Vendor Management section
- Document review: Click "View" on vendor row

---

**Implementation Complete**: April 30, 2026  
**Status**: ✅ READY FOR TESTING  
**Next**: Production deployment with email service

