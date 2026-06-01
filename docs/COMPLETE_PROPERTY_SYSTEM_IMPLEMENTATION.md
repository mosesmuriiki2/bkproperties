# Complete Property System Implementation Plan

## Requirements Summary

### 1. Home Page Property Display
- Show approved properties (status = ACTIVE)
- Display property images
- Allow users to inquire about properties

### 2. Property Inquiry System
- Users can submit inquiries
- Store inquiries in database
- Vendors can see inquiries in their dashboard
- Admin can see all inquiries

### 3. Vendor Registration Flow
- "Apply to Become a Property Owner" page
- Submit application with documents
- Admin approves vendor
- Approved vendor can login and upload properties

### 4. Dynamic Property Form
- Form fields change based on property type:
  - **HOUSE**: bedrooms, bathrooms, area
  - **LAND**: land size, zoning
  - **APARTMENT**: bedrooms, bathrooms, floor, area
  - **COMMERCIAL**: area, parking spaces

### 5. Dynamic Sub-Counties
- Sub-county dropdown updates based on selected county
- Use Kenyan counties data

## Implementation Steps

### Phase 1: Database Schema
Create tables for:
- `property_inquiries` - Store user inquiries
- Update `vendors` table if needed

### Phase 2: Backend APIs
- Property inquiry endpoints
- Vendor registration endpoints
- Active properties endpoint

### Phase 3: Frontend Components
- Home page property listing
- Property inquiry form
- Vendor registration page
- Dynamic property form in VendorDashboard
- Dynamic sub-county selector

### Phase 4: Integration
- Connect all components
- Test complete flow

## Files to Create/Modify

### Backend
1. `PropertyInquiry.java` - Entity
2. `PropertyInquiryRepository.java` - Repository
3. `PropertyInquiryService.java` - Service
4. `PropertyInquiryController.java` - Controller
5. Update `PropertyService.java` - Add active properties method
6. Update `VendorController.java` - Add registration endpoint

### Frontend
1. `src/pages/Home.jsx` - Update to show properties
2. `src/pages/VendorRegistration.jsx` - New vendor application page
3. `src/components/PropertyInquiryForm.jsx` - Inquiry form component
4. `src/data/kenyanCounties.js` - Update with sub-counties
5. Update `src/pages/VendorDashboard.jsx` - Dynamic form + sub-counties
6. Update `src/api/apiClient.js` - Add inquiry endpoints

## Database Schema

### property_inquiries table
```sql
CREATE TABLE property_inquiries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    message TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);
```

## Next Steps
Execute implementation in order...
