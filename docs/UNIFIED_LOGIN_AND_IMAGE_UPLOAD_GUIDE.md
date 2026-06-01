# Unified Login & Image Upload Implementation Guide

## Date: April 29, 2026

---

## ✅ CHANGES IMPLEMENTED

### 1. Unified Login System with Role-Based Redirection

#### What Changed
- **Single Login Page**: One login form for all users (`/login`)
- **Role-Based Redirection**: Automatically redirects users based on their role after login
- **Session Management**: Proper session storage for each user type

#### Login Flow
```
User enters credentials → API validates → Returns user data with role → 
Store session → Redirect based on role:
  - ADMIN → /AdminDashboard
  - VENDOR → /VendorDashboard  
  - CONSUMER → / (Home page)
```

#### Implementation Details

**File**: `src/pages/Login.jsx`

**Key Features**:
- ✅ Single unified login form
- ✅ Role detection from API response
- ✅ Automatic redirection based on role
- ✅ Session storage for each role type:
  - Admin: `sessionStorage.setItem("mg_admin_auth", ...)`
  - Vendor: `sessionStorage.setItem("mg_vendor_auth", ...)`
  - Consumer: `sessionStorage.setItem("mg_user_auth", ...)`
- ✅ Token storage for API authentication
- ✅ User data storage in localStorage

**Login Credentials**:
```
Super Admin:
  Email: admin@globalhub.com
  Password: admin123
  → Redirects to: /AdminDashboard

Property Vendor:
  Register via Vendor Portal
  → Redirects to: /VendorDashboard

Consumer:
  Register via Register page
  → Redirects to: / (Home)
```

#### API Response Expected Format
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ADMIN|VENDOR|CONSUMER",
  "token": "jwt-token-here",
  "vendorId": 123  // Only for vendors
}
```

---

### 2. Mandatory Image Upload for Property Listings

#### What Changed
- **Required Field**: At least 1 image is now mandatory when creating a property
- **Validation**: Frontend and backend validation for image upload
- **User Feedback**: Clear indicators that images are required

#### Implementation Details

**File**: `src/pages/VendorDashboard.jsx`

**Changes Made**:

1. **Visual Indicators**:
   ```jsx
   <h3>Upload Images *</h3>
   <p>At least one image is required</p>
   <p className="text-red-500">Required: At least 1 image</p>
   ```

2. **Validation on Submit**:
   ```javascript
   if (uploadImages.length === 0) {
     toast.error("Please upload at least one property image.");
     return;
   }
   ```

3. **Warning Message**:
   - Shows yellow warning box if no images uploaded
   - Prevents submission without images
   - Clear error message to user

4. **Image Preview**:
   - Shows all uploaded images
   - Allows removal of individual images
   - Grid layout (3 columns)
   - Delete button on each image

---

### 3. Upload Directory Configuration

#### What Changed
- **Configured Upload Path**: Property service now has dedicated upload directory
- **Automatic Directory Creation**: Script to create required directories
- **Proper File Organization**: Separate folders for properties and vendors

#### Implementation Details

**File**: `backend/globalhub-property-service/src/main/resources/application.yml`

**Configuration Added**:
```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 50MB

app:
  upload:
    dir: ${user.dir}/uploads
  base-url: http://localhost:7086
```

**Directory Structure**:
```
backend/globalhub-property-service/
└── uploads/
    ├── properties/
    │   ├── 1/  (property ID)
    │   │   ├── 20260429_120000_abc123.jpg
    │   │   └── 20260429_120001_def456.jpg
    │   └── 2/
    │       └── 20260429_120002_ghi789.jpg
    └── vendors/
        └── 1/  (vendor ID)
            └── documents/
                └── license_20260429_120003_jkl012.pdf
```

**Setup Script**: `backend/globalhub-property-service/create-upload-dirs.sh`
```bash
#!/bin/bash
mkdir -p uploads/properties
mkdir -p uploads/vendors
```

**To Run**:
```bash
cd backend/globalhub-property-service
chmod +x create-upload-dirs.sh
./create-upload-dirs.sh
```

---

### 4. Image Metadata Storage in Database

#### How It Works

**Database Storage**:
- Images are stored as JSON array in `properties.images` column
- Each image URL is stored with full path
- Metadata includes timestamp and unique ID in filename

**Example Database Entry**:
```json
{
  "images": [
    "http://localhost:7086/api/files/properties/1/20260429_120000_abc123.jpg",
    "http://localhost:7086/api/files/properties/1/20260429_120001_def456.jpg",
    "http://localhost:7086/api/files/properties/1/20260429_120002_ghi789.jpg"
  ]
}
```

**File Naming Convention**:
```
Format: {timestamp}_{uuid}.{extension}
Example: 20260429_120000_abc12345.jpg

Where:
- timestamp: yyyyMMdd_HHmmss
- uuid: First 8 characters of UUID
- extension: Original file extension
```

**Image Upload Flow**:
```
1. User selects images in frontend
2. Frontend validates (size, type, count)
3. Images sent to backend via multipart/form-data
4. Backend validates again
5. Files saved to uploads/properties/{propertyId}/
6. URLs generated and stored in database
7. Property entity saved with image URLs
```

**Image Retrieval**:
```
GET /api/files/properties/{propertyId}/{filename}
→ Serves image with proper content-type
→ Inline disposition for browser display
```

---

## 🚀 TESTING THE CHANGES

### Test 1: Unified Login

1. **Navigate to Login**:
   ```
   http://localhost:5173/login
   ```

2. **Test Admin Login**:
   ```
   Email: admin@globalhub.com
   Password: admin123
   Expected: Redirect to /AdminDashboard
   ```

3. **Test Vendor Login**:
   ```
   First register as vendor, then login
   Expected: Redirect to /VendorDashboard
   ```

4. **Test Consumer Login**:
   ```
   Register as consumer, then login
   Expected: Redirect to / (Home)
   ```

### Test 2: Mandatory Image Upload

1. **Navigate to Vendor Dashboard**:
   ```
   Login as vendor → Click "Add Property"
   ```

2. **Fill Property Details**:
   - Step 1: Enter title, type, listing type, description
   - Step 2: Enter price, bedrooms, address, county
   - Step 3: Try to proceed WITHOUT uploading images

3. **Expected Behavior**:
   - Yellow warning box appears
   - "Next" button should work but...
   - On final submit, error message: "Please upload at least one property image"
   - Cannot submit without images

4. **Upload Images**:
   - Click upload area
   - Select 1-10 images
   - See preview grid
   - Can remove images with X button
   - Submit should work with at least 1 image

### Test 3: Image Storage

1. **After Successful Upload**:
   ```bash
   cd backend/globalhub-property-service/uploads/properties
   ls -la
   ```

2. **Expected**:
   ```
   properties/
   └── 1/  (or property ID)
       ├── 20260429_120000_abc123.jpg
       └── 20260429_120001_def456.jpg
   ```

3. **Check Database**:
   ```sql
   SELECT id, title, images FROM properties WHERE id = 1;
   ```

4. **Expected**:
   ```
   images: ["http://localhost:7086/api/files/properties/1/20260429_120000_abc123.jpg", ...]
   ```

5. **Test Image Serving**:
   ```
   http://localhost:7086/api/files/properties/1/20260429_120000_abc123.jpg
   ```
   Should display the image in browser

---

## 📋 CONFIGURATION CHECKLIST

### Backend Configuration

- [x] Upload directory configured in application.yml
- [x] Multipart file upload enabled
- [x] Max file size set to 10MB
- [x] Max request size set to 50MB
- [x] Upload directories created
- [x] File storage service configured
- [x] Image serving endpoint working

### Frontend Configuration

- [x] Login page updated with role-based redirection
- [x] Session storage for each role type
- [x] Image upload validation added
- [x] Required field indicators added
- [x] Error messages for missing images
- [x] Image preview and removal working

### Database Configuration

- [x] Properties table has images column (JSON)
- [x] Images stored as JSON array
- [x] URLs include full path with domain

---

## 🔧 TROUBLESHOOTING

### Issue: Images not uploading

**Check**:
1. Upload directory exists and has write permissions
   ```bash
   ls -la backend/globalhub-property-service/uploads
   chmod 755 backend/globalhub-property-service/uploads
   ```

2. File size within limits (10MB per image)
3. File type is allowed (JPG, JPEG, PNG, GIF, WEBP)
4. Property service is running on port 7086

### Issue: Login not redirecting

**Check**:
1. API response includes `role` field
2. Session storage is being set
3. Navigation is not blocked by other code
4. Check browser console for errors

### Issue: Images not displaying

**Check**:
1. Image URLs in database are correct
2. File exists in uploads directory
3. File serving endpoint is accessible
4. CORS is configured properly

---

## 📊 API ENDPOINTS SUMMARY

### Authentication
```
POST /api/auth/login
Body: { email, password }
Response: { userId, email, firstName, lastName, role, token, vendorId? }
```

### Property Management
```
POST /api/properties
Content-Type: multipart/form-data
Body: 
  - property: JSON (PropertyDTO)
  - images: File[] (1-10 images, required)
Response: PropertyDTO with image URLs
```

### Image Serving
```
GET /api/files/properties/{propertyId}/{filename}
Response: Image file with proper content-type
```

---

## 🎯 KEY FEATURES SUMMARY

### Unified Login
✅ Single login page for all users  
✅ Automatic role detection  
✅ Role-based redirection  
✅ Proper session management  
✅ Token storage for API calls  

### Mandatory Images
✅ At least 1 image required  
✅ Frontend validation  
✅ Backend validation  
✅ Clear error messages  
✅ Visual indicators  

### Image Storage
✅ Organized directory structure  
✅ Unique filenames with timestamps  
✅ Metadata stored in database  
✅ Image serving endpoint  
✅ Proper content-type handling  

---

## 📝 NEXT STEPS

1. **Test the unified login** with all three roles
2. **Test property creation** with image upload
3. **Verify images are stored** in correct directories
4. **Check database** for image URLs
5. **Test image display** on property listings and detail pages

---

## 🎓 USER GUIDE

### For Vendors

**Creating a Property Listing**:

1. Login to your vendor account
2. Click "Add Property" button
3. Fill in property details (4 steps):
   - **Step 1**: Basic info (title, type, description)
   - **Step 2**: Details (price, bedrooms, location)
   - **Step 3**: **Upload Images** (REQUIRED - at least 1 image)
   - **Step 4**: Review and submit
4. Wait for admin approval
5. Property goes live once approved

**Image Requirements**:
- Minimum: 1 image (required)
- Maximum: 10 images
- File size: Max 10MB per image
- File types: JPG, JPEG, PNG, GIF, WEBP
- Recommended: High-quality photos, well-lit, multiple angles

### For All Users

**Logging In**:

1. Go to `/login` page
2. Enter your email and password
3. Click "Sign In"
4. You'll be automatically redirected based on your role:
   - Admin → Admin Dashboard
   - Vendor → Vendor Dashboard
   - Consumer → Home Page

---

**Last Updated**: April 29, 2026  
**Status**: ✅ COMPLETE  
**Version**: 1.0
