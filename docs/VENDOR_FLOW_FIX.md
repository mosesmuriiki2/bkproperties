# Vendor Flow Fix Guide

## Issues Identified

1. ❌ Documents not uploading to database or filesystem
2. ❌ Vendor dashboard empty
3. ❌ Admin can't see vendors/properties

---

## Root Causes

### 1. Upload Folder Missing
- **Problem**: `/uploads` folder didn't exist
- **Fix**: Created with proper permissions
```bash
mkdir -p uploads/vendor-documents uploads/property-images
chmod -R 755 uploads
```

### 2. API Endpoint Mismatch
- **Problem**: Frontend calling wrong document upload endpoint
- **Fix**: Changed from `/documents` to `/documents/upload`

### 3. Vendor Dashboard Not Loading Data
- **Problem**: Not fetching vendor by userId
- **Fix**: Added `fetchVendorByUserId()` function

### 4. Admin Dashboard API Calls
- **Problem**: Using generic `apiClient.get()` instead of specific methods
- **Fix**: Updated to use `apiClient.vendors.getAll()` and `apiClient.vendors.approve()`

---

## Files Modified

### Frontend

1. **src/pages/ListProperty.jsx**
   - Fixed document upload endpoint: `/api/vendors/{id}/documents/upload`
   - Fixed property creation to use `api.properties.create()`
   - Added error handling and logging

2. **src/pages/VendorDashboard.jsx**
   - Added `fetchVendorByUserId()` to get vendor profile
   - Fixed property loading to use correct vendorId
   - Added proper error handling

3. **src/api/apiClient.js**
   - Added `api.vendors.getByUserId(userId)`
   - Added `api.vendors.approve(vendorId)`
   - Added `api.vendors.reject(vendorId, reason)`
   - Fixed `api.vendors.getAll()` to support pagination

4. **src/pages/AdminDashboard.jsx**
   - Updated `loadVendors()` to use `apiClient.vendors.getAll()`
   - Updated `handleApproveVendor()` to use `apiClient.vendors.approve()`
   - Updated `handleRejectVendor()` to use `apiClient.vendors.reject()`
   - Added response format handling for both array and paginated responses

### Backend

1. **backend/globalhub-vendor-service/.../VendorController.java**
   - Updated `getAllVendors()` to return paginated response format
   - Added pagination parameters (page, size)
   - Returns consistent response structure

---

## Testing Steps

### 1. Restart Backend Services

```bash
cd backend

# Stop all services
pkill -f "java.*globalhub"

# Start services
cd globalhub-auth-service && mvn spring-boot:run &
cd globalhub-vendor-service && mvn spring-boot:run &
cd globalhub-property-service && mvn spring-boot:run &
cd globalhub-gateway && mvn spring-boot:run &

# Wait for services to start
sleep 30
```

### 2. Test Vendor Registration

```bash
# Register user with VENDOR role
curl -X POST http://localhost:7072/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testvendor@test.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "Vendor",
    "phone": "+254700000001",
    "role": "VENDOR"
  }'

# Save the userId and accessToken from response
```

### 3. Test Vendor Profile Creation

```bash
# Create vendor profile (replace USER_ID and TOKEN)
curl -X POST http://localhost:8084/api/vendors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": USER_ID,
    "businessName": "Test Properties",
    "businessType": "company",
    "propertyCategory": "BOTH",
    "listingType": "BOTH",
    "email": "testvendor@test.com",
    "phone": "+254700000001",
    "address": "123 Test St",
    "county": "Nairobi",
    "subCounty": "Westlands",
    "idNumber": "12345678"
  }'

# Save the vendor id from response
```

### 4. Test Document Upload

```bash
# Upload documents (replace VENDOR_ID and TOKEN)
curl -X POST http://localhost:8084/api/vendors/VENDOR_ID/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "idDocument=@/path/to/id.jpg" \
  -F "businessLicense=@/path/to/license.pdf"

# Check uploads folder
ls -la uploads/vendor-documents/
```

### 5. Test Property Creation

```bash
# Create property (replace VENDOR_ID and TOKEN)
curl -X POST http://localhost:8083/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vendorId": VENDOR_ID,
    "title": "Test Property",
    "description": "Test description",
    "propertyType": "HOUSE",
    "listingType": "SALE",
    "price": 5000000,
    "bedrooms": 3,
    "bathrooms": 2,
    "address": "Test Address",
    "county": "Nairobi",
    "subCounty": "Westlands"
  }'
```

### 6. Test Vendor Dashboard

```bash
# Get vendor by userId
curl -X GET http://localhost:8084/api/vendors/user/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get vendor properties
curl -X GET http://localhost:8083/api/properties/vendor/VENDOR_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Test Admin Dashboard

```bash
# Login as admin
curl -X POST http://localhost:7072/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@gmail.com",
    "password": "admin@123"
  }'

# Get all vendors
curl -X GET http://localhost:8084/api/vendors?page=0&size=50 \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get pending properties
curl -X GET http://localhost:8083/api/properties/pending?page=0&size=50 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Frontend Testing

### 1. Clear Browser Data
```javascript
// Open browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Test Property Listing Submission

1. Go to: `http://localhost:5173/list-property`
2. Fill in all vendor information
3. Upload ID document (required)
4. Upload business license (optional)
5. Continue to property details
6. Fill in property information
7. Upload property images
8. Submit
9. Check browser console for errors
10. Check network tab for API calls

### 3. Test Vendor Login

1. Go to: `http://localhost:5173/vendor-login`
2. Enter vendor email
3. Click "Send OTP"
4. Check auth service logs for OTP:
   ```bash
   tail -f backend/globalhub-auth-service/logs/application.log | grep OTP
   ```
5. Enter OTP
6. Click "Verify & Login"
7. Should redirect to vendor dashboard

### 4. Test Vendor Dashboard

1. After login, should see vendor dashboard
2. Check "My Properties" section
3. Should see submitted property with status
4. Check browser console for errors
5. Check network tab for API calls

### 5. Test Admin Dashboard

1. Go to: `http://localhost:5173/login`
2. Login with: `superadmin@gmail.com` / `admin@123`
3. Navigate to "Property Management"
4. Should see pending properties
5. Navigate to "Vendor Management"
6. Should see all vendors
7. Test approve/reject actions

---

## Database Verification

### Check Users
```sql
USE globalhub;
SELECT id, email, first_name, last_name, role, is_active 
FROM users 
WHERE role = 'VENDOR';
```

### Check Vendors
```sql
SELECT v.id, v.user_id, v.business_name, v.email, v.status, v.created_at
FROM vendors v
ORDER BY v.created_at DESC;
```

### Check Vendor Documents
```sql
SELECT vd.id, vd.vendor_id, vd.document_type, vd.document_url, vd.status
FROM vendor_documents vd
ORDER BY vd.uploaded_at DESC;
```

### Check Properties
```sql
SELECT p.id, p.vendor_id, p.title, p.status, p.price, p.created_at
FROM properties p
ORDER BY p.created_at DESC;
```

### Join Query - Full Vendor Info
```sql
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    v.id as vendor_id,
    v.business_name,
    v.status as vendor_status,
    COUNT(p.id) as property_count
FROM users u
LEFT JOIN vendors v ON u.id = v.user_id
LEFT JOIN properties p ON v.id = p.vendor_id
WHERE u.role = 'VENDOR'
GROUP BY u.id, v.id;
```

---

## Common Issues & Solutions

### Issue 1: "Vendor not found for userId"
**Cause**: Vendor profile not created after user registration  
**Solution**: Ensure vendor registration API is called after user registration

### Issue 2: Documents not in database
**Cause**: Wrong endpoint or file upload failed  
**Solution**: 
- Check endpoint is `/api/vendors/{id}/documents/upload`
- Check uploads folder exists and has write permissions
- Check file size (max 10MB)
- Check file type (jpg, png, pdf only)

### Issue 3: Vendor dashboard empty
**Cause**: Not fetching vendor by userId  
**Solution**: Updated VendorDashboard to call `/api/vendors/user/{userId}`

### Issue 4: Admin can't see vendors
**Cause**: API response format mismatch  
**Solution**: Updated AdminDashboard to handle both array and paginated responses

### Issue 5: Properties not showing
**Cause**: Wrong vendorId or API endpoint  
**Solution**: 
- Verify vendorId is correct
- Check endpoint is `/api/properties/vendor/{vendorId}`
- Verify property status (DRAFT, ACTIVE, etc.)

---

## Verification Checklist

After applying fixes, verify:

- [ ] Upload folders exist with proper permissions
- [ ] Backend services are running
- [ ] User can register with VENDOR role
- [ ] Vendor profile is created
- [ ] Documents upload to filesystem
- [ ] Documents saved to database
- [ ] Property is created
- [ ] Property images upload to filesystem
- [ ] Vendor can login with OTP
- [ ] Vendor dashboard shows properties
- [ ] Vendor dashboard shows correct status
- [ ] Admin can see all vendors
- [ ] Admin can see all properties
- [ ] Admin can approve vendors
- [ ] Admin can approve properties
- [ ] Approved properties visible on homepage

---

## Quick Fix Commands

```bash
# Create upload folders
mkdir -p uploads/vendor-documents uploads/property-images
chmod -R 755 uploads

# Check services are running
curl http://localhost:7072/actuator/health  # Auth service
curl http://localhost:8084/actuator/health  # Vendor service
curl http://localhost:8083/actuator/health  # Property service

# Check database
mysql -u root -proot -e "USE globalhub; SELECT COUNT(*) FROM vendors;"
mysql -u root -proot -e "USE globalhub; SELECT COUNT(*) FROM properties;"

# Clear frontend cache
# In browser console:
# localStorage.clear(); sessionStorage.clear(); location.reload();
```

---

## Next Steps

1. **Test the complete flow** from property submission to admin approval
2. **Monitor logs** for any errors during the process
3. **Check database** after each step to verify data is saved
4. **Verify file uploads** in the uploads folder
5. **Test with different file types** and sizes

---

**Status**: ✅ FIXES APPLIED  
**Date**: April 30, 2026  
**Ready for**: Testing and Verification

