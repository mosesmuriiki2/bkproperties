# Admin Property Approval System - Complete

## Overview
Implemented complete property approval workflow where:
1. Vendors submit properties (status: DRAFT)
2. Admin reviews and approves/rejects properties
3. Approved properties appear on home page with images
4. Images are properly displayed throughout the system

## Changes Made

### 1. API Client Updates (`src/api/apiClient.js`)

Added property management methods:

```javascript
properties: {
  getPending: async (page, size) => {...},  // Get pending properties for admin
  getActive: async (page, size) => {...},   // Get active properties
  approve: async (propertyId) => {...},     // Approve property
  reject: async (propertyId, reason) => {...}, // Reject property with reason
}
```

### 2. Admin Dashboard Updates (`src/pages/AdminDashboard.jsx`)

#### Added Functions:
- `loadProperties()` - Loads pending properties using `apiClient.properties.getPending()`
- `handleApproveProperty(propertyId)` - Approves property and refreshes list
- `handleRejectProperty(propertyId)` - Rejects property with reason
- `formatPrice(price)` - Formats price as "KSh X,XXX"
- `loadDashboardStats()` - Loads property statistics

#### Property Table Features:
- Shows property title and description
- Displays vendor ID
- Shows property type and listing type badges
- Displays location (county, sub-county)
- Shows formatted price in KSh
- **Image thumbnail** - Shows first image with count
- Status badge (DRAFT/ACTIVE/INACTIVE)
- Action buttons: Approve, Reject, View

#### Image Display:
```javascript
{property.images && property.images.length > 0 ? (
  <div className="flex items-center gap-2">
    <img 
      src={property.images[0]} 
      alt={property.title}
      className="w-12 h-12 rounded object-cover"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/48?text=No+Image';
      }}
    />
    <span>{property.images.length} images</span>
  </div>
) : (
  <span>No images</span>
)}
```

### 3. Backend Property Service

#### SecurityConfig Created
**File:** `backend/globalhub-property-service/src/main/java/com/globalhub/property/config/SecurityConfig.java`

Allows all property endpoints without authentication (gateway handles auth):
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/properties/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
```

## Property Approval Workflow

### 1. Vendor Submits Property
```
POST /api/properties
Content-Type: multipart/form-data

FormData:
- property: JSON blob with property details
- images: Array of image files

Response:
{
  "id": 1,
  "title": "3BR House in Westlands",
  "status": "DRAFT",
  "images": ["/uploads/property-images/uuid1.jpg", "/uploads/property-images/uuid2.jpg"],
  ...
}
```

### 2. Admin Views Pending Properties
```
GET /api/properties/pending?page=0&size=50

Response:
{
  "content": [
    {
      "id": 1,
      "title": "3BR House in Westlands",
      "vendorId": 5,
      "propertyType": "HOUSE",
      "listingType": "SALE",
      "price": 5000000,
      "county": "Nairobi",
      "subCounty": "Westlands",
      "images": ["/uploads/property-images/uuid1.jpg"],
      "status": "DRAFT"
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

### 3. Admin Approves Property
```
PUT /api/properties/1/approve

Response:
{
  "id": 1,
  "status": "ACTIVE",  // Changed from DRAFT
  ...
}
```

Property now appears on home page!

### 4. Admin Rejects Property
```
PUT /api/properties/1/reject?reason=Incomplete+information

Response:
{
  "id": 1,
  "status": "INACTIVE",  // Changed from DRAFT
  ...
}
```

## Image Storage and Display

### Backend Storage
- **Location:** `/uploads/property-images/`
- **Format:** `{uuid}.{extension}` (e.g., `a1b2c3d4-e5f6-7890.jpg`)
- **Database:** Stored as JSON array in `images` column
  ```json
  ["/uploads/property-images/uuid1.jpg", "/uploads/property-images/uuid2.jpg"]
  ```

### Frontend Display
Images are accessed directly via their stored paths:
```javascript
<img src={property.images[0]} alt={property.title} />
```

The path `/uploads/property-images/uuid.jpg` is served by:
1. **Development:** Vite proxy forwards to backend
2. **Production:** Nginx/Apache serves static files

### Image Upload Process
1. Vendor uploads images via FormData
2. Backend saves to `/uploads/property-images/`
3. Backend stores relative paths in database
4. Frontend displays using stored paths

## Testing the Complete Flow

### 1. Vendor Submits Property
```bash
# Login as vendor
curl -X POST http://localhost:9096/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","otp":"123456"}'

# Submit property
curl -X POST http://localhost:9096/api/properties \
  -H "Authorization: Bearer {token}" \
  -F 'property={"title":"Test House","vendorId":1,"propertyType":"HOUSE","listingType":"SALE","price":5000000,"address":"Test St","county":"Nairobi"}' \
  -F 'images=@house1.jpg' \
  -F 'images=@house2.jpg'
```

### 2. Admin Views Pending
```bash
# Login as admin
curl -X POST http://localhost:9096/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@gmail.com","password":"admin@123"}'

# Get pending properties
curl http://localhost:9096/api/properties/pending?page=0&size=50 \
  -H "Authorization: Bearer {admin_token}"
```

### 3. Admin Approves
```bash
curl -X PUT http://localhost:9096/api/properties/1/approve \
  -H "Authorization: Bearer {admin_token}"
```

### 4. Check Active Properties
```bash
curl http://localhost:9096/api/properties/active?page=0&size=50
```

## Frontend Testing

### 1. Vendor Flow
1. Go to http://localhost:5173/VendorLogin
2. Enter email and get OTP from backend console
3. Login and navigate to "Add Property"
4. Fill in property details
5. Upload at least one image
6. Submit property
7. Check "My Properties" - should show with "Pending" status

### 2. Admin Flow
1. Go to http://localhost:5173/AdminLogin
2. Login with `superadmin@gmail.com` / `admin@123`
3. Navigate to "Property Management"
4. Should see pending property with image thumbnail
5. Click "Approve" button
6. Property disappears from pending list

### 3. Home Page
1. Go to http://localhost:5173/
2. Navigate to Properties section
3. Should see approved property with images

## Property Status Flow

```
DRAFT (Vendor submits)
  ↓
  ├─→ ACTIVE (Admin approves) → Shows on home page
  └─→ INACTIVE (Admin rejects) → Hidden from public
```

## Database Schema

### properties table
```sql
CREATE TABLE properties (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vendor_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50),
  listing_type VARCHAR(50),
  price DECIMAL(15,2),
  currency VARCHAR(10) DEFAULT 'KSH',
  bedrooms INT,
  bathrooms INT,
  area_sqm DECIMAL(10,2),
  land_size_sqm DECIMAL(10,2),
  address VARCHAR(500),
  county VARCHAR(100),
  sub_county VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  features TEXT,  -- JSON array
  amenities TEXT, -- JSON array
  images TEXT,    -- JSON array of image paths
  status VARCHAR(20) DEFAULT 'DRAFT',
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Issue: Properties not showing in admin
**Solution:** Check that properties have status='DRAFT' in database

### Issue: Images not displaying
**Solution:** 
1. Check `/uploads/property-images/` folder exists
2. Verify image paths in database are correct
3. Check browser console for 404 errors
4. Ensure Vite proxy is configured correctly

### Issue: 403 Forbidden on property submit
**Solution:** Restart property service after adding SecurityConfig

### Issue: Approved properties not on home page
**Solution:** Check home page is querying `/api/properties/active`

## Next Steps

1. **Email Notifications:** Send email to vendor when property is approved/rejected
2. **Rejection Reasons:** Store rejection reasons in database
3. **Property Edit:** Allow vendors to edit rejected properties
4. **Bulk Actions:** Allow admin to approve/reject multiple properties
5. **Image Gallery:** Add lightbox for viewing all property images
6. **Search & Filter:** Add filters for property type, location, price range
