# Vendor Dashboard Submit Button Fix

## Problems Fixed

### 1. Property Submission Not Working ✅
**Issue:** Submit button in VendorDashboard wasn't working when vendors tried to submit properties.

**Root Causes:**
1. Using incorrect API method - `apiClient.post()` instead of `apiClient.properties.create()`
2. Missing vendorId validation before submission
3. Not passing vendorId parameter to `loadVendorProperties()` after submission
4. Token not being found - apiClient only checked `localStorage.getItem('accessToken')`

**Solutions Applied:**
- Updated `handleUploadSubmit()` to use `apiClient.properties.create(propertyData, uploadImages)`
- Added vendorId validation before submission
- Fixed `loadVendorProperties()` call to pass vendorId parameter
- Updated token retrieval to check multiple locations: sessionStorage.token, localStorage.token, localStorage.accessToken

### 2. Vendor Properties Not Loading ✅
**Issue:** Vendors couldn't see their submitted properties in the dashboard.

**Root Causes:**
1. Using incorrect API method - `apiClient.get()` instead of `apiClient.properties.getByVendor()`
2. Using incorrect API method for vendor fetch - `apiClient.get()` instead of `apiClient.vendors.getByUserId()`
3. Incorrect response data extraction

**Solutions Applied:**
- Updated `loadVendorProperties()` to use `apiClient.properties.getByVendor(vendorId)`
- Updated `fetchVendorByUserId()` to use `apiClient.vendors.getByUserId(userId)`
- Fixed response handling to support both paginated and direct array responses

## Files Modified

### 1. `src/pages/VendorDashboard.jsx`

**handleUploadSubmit function:**
```javascript
// BEFORE
await apiClient.post('/properties', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
loadVendorProperties(); // Missing vendorId parameter

// AFTER
await apiClient.properties.create(propertyData, uploadImages);
if (vendorId) {
  loadVendorProperties(vendorId); // Correct parameter
}
```

**loadVendorProperties function:**
```javascript
// BEFORE
const response = await apiClient.get(`/properties/vendor/${vId}?page=0&size=100`);
setProperties(response.data.content || []);

// AFTER
const response = await apiClient.properties.getByVendor(vId);
setProperties(response.content || response || []);
```

**fetchVendorByUserId function:**
```javascript
// BEFORE
const response = await apiClient.get(`/vendors/user/${userId}`);
const vendor = response.data;

// AFTER
const vendor = await apiClient.vendors.getByUserId(userId);
```

### 2. `src/api/apiClient.js`

**getAuthHeaders function:**
```javascript
// BEFORE
const token = localStorage.getItem('accessToken');

// AFTER
const token = sessionStorage.getItem('token') || 
              localStorage.getItem('token') || 
              localStorage.getItem('accessToken');
```

**properties.create method:**
```javascript
// BEFORE
const token = localStorage.getItem('accessToken');

// AFTER
const token = sessionStorage.getItem('token') || 
              localStorage.getItem('token') || 
              localStorage.getItem('accessToken');
```

## How Property Submission Works Now

1. **Vendor fills property form** (3 steps):
   - Step 1: Basic Info (title, type, listing type, price, location)
   - Step 2: Property Details (bedrooms, bathrooms, area, features)
   - Step 3: Images (upload property photos)
   - Step 4: Review & Submit

2. **Validation checks**:
   - All required fields filled
   - At least one image uploaded
   - VendorId is loaded

3. **Submission process**:
   - Prepare property data with proper types (parseFloat for price, parseInt for bedrooms)
   - Call `apiClient.properties.create(propertyData, uploadImages)`
   - FormData is created with:
     - `property`: JSON string of property data
     - `images`: Array of image files
   - Authorization header with Bearer token

4. **Backend processing**:
   - PropertyController receives multipart/form-data
   - PropertyService creates Property entity with status DRAFT
   - FileStorageService uploads images to `/uploads/property-images/`
   - Property saved to database

5. **Post-submission**:
   - Success toast shown
   - Upload form marked as done
   - Properties list refreshed to show new property
   - Property appears with "Pending" status

## How Property Fetching Works Now

1. **On dashboard load**:
   - Get userId from sessionStorage (`mg_vendor_auth`)
   - Call `fetchVendorByUserId(userId)`
   - Get vendor profile from backend
   - Extract vendorId from vendor profile
   - Call `loadVendorProperties(vendorId)`

2. **API call**:
   - `GET /api/properties/vendor/{vendorId}?page=0&size=100`
   - Returns paginated response with property list
   - Extract properties from `response.content` or `response`

3. **Display**:
   - Properties shown in "My Properties" section
   - Each property shows: title, type, price, status, views
   - Status badges: Pending (yellow), Active (green), Rejected (red)

## Token Storage Strategy

The application now supports multiple token storage locations for flexibility:

1. **sessionStorage.token** - Used by VendorDashboard
2. **localStorage.token** - Used by regular login
3. **localStorage.accessToken** - Used by VendorLogin and auth service

The apiClient checks all three locations in order, ensuring tokens are found regardless of which login method was used.

## Testing

### Test Property Submission:
1. Login as vendor via `/VendorLogin`
2. Navigate to "Add Property" section
3. Fill in all required fields:
   - Title: "Test Property"
   - Property Type: "HOUSE"
   - Listing Type: "SALE"
   - Price: "5000000"
   - Address: "123 Test Street"
   - County: "Nairobi"
4. Upload at least one image
5. Click "Submit for Review"
6. Verify success toast appears
7. Check "My Properties" section - new property should appear with "Pending" status

### Test Property Fetching:
1. Login as vendor
2. Dashboard should automatically load vendor properties
3. Navigate to "My Properties" section
4. All vendor's properties should be listed
5. Each property should show correct details and status

## Backend Requirements

Ensure these endpoints are working:

1. **POST /api/properties** - Create property with images
   - Accepts multipart/form-data
   - Requires: property (JSON), images (files)
   - Returns: PropertyDTO

2. **GET /api/properties/vendor/{vendorId}** - Get vendor properties
   - Returns: Page<PropertyDTO>

3. **GET /api/vendors/user/{userId}** - Get vendor by userId
   - Returns: VendorDTO with id field

## Common Issues & Solutions

### Issue: "Vendor profile not loaded"
**Solution:** Ensure vendor record exists in database for the logged-in user

### Issue: "Failed to submit property"
**Solution:** Check:
- Token is valid and not expired
- VendorId is set correctly
- All required fields are filled
- Images are valid (< 10MB, image format)

### Issue: Properties not showing
**Solution:** Check:
- Vendor has properties in database
- Properties have correct vendorId
- API endpoint returns data correctly
- Response format matches expected structure

### Issue: 401 Unauthorized
**Solution:** Check:
- Token is stored correctly in localStorage/sessionStorage
- Token is not expired
- Authorization header is being sent
- Gateway is forwarding auth headers correctly
