# Add Sample Properties to Database

## Quick Steps

### 1. Ensure You Have a Vendor in the Database

Before adding properties, you need at least one vendor. You can:
- Create a vendor through the vendor registration flow in the app
- Or use the super admin to approve a vendor

### 2. Run the SQL Script

```bash
# Connect to your MySQL database
mysql -u root -p globalhub_db

# Run the SQL script
source backend/add-sample-properties.sql

# Or copy-paste the SQL commands directly
```

### 3. Verify Properties Were Added

```sql
SELECT id, title, property_type, listing_type, price, status, county 
FROM properties 
WHERE status = 'ACTIVE' 
ORDER BY created_at DESC;
```

You should see 6 sample properties with ACTIVE status.

### 4. View Properties on Home Page

1. Open your browser and go to `http://localhost:5173`
2. Scroll down to the "Featured Properties" section
3. You should see the approved properties from the database displayed with:
   - Property images
   - Title and location
   - Price in KSH
   - Bedrooms/bathrooms (for houses/apartments)
   - "Inquire Now" button

## What Was Implemented

### Frontend Changes (src/pages/Home.jsx)
- ✅ Added `loadProperties()` function to fetch ACTIVE properties from API
- ✅ Added `formatPrice()` helper to format prices in KSH
- ✅ Replaced hardcoded `featuredListings` with real `properties` from database
- ✅ Added loading state with spinner
- ✅ Added empty state message
- ✅ Property cards now show:
  - Real property images (or placeholder if no image)
  - Property type badge
  - Title and location (county, sub-county)
  - Price in KSH format
  - Bedrooms/bathrooms for applicable properties
  - "Inquire Now" button

### API Integration
- Uses `apiClient.properties.getActive(0, 6)` to fetch up to 6 active properties
- Automatically loads on page mount via `useEffect`

## Next Steps

The following features are still pending:

### 1. Property Inquiry System
- Users click "Inquire Now" button
- Modal/form to submit inquiry with name, email, phone, message
- Store inquiries in database
- Vendors can view inquiries in their dashboard
- Admin can view all inquiries

### 2. Vendor Registration Flow
- "Apply to Become a Property Owner" page
- Vendor submits business info and documents
- Admin approves/rejects vendor applications
- Approved vendors can login and list properties

### 3. Dynamic Form Fields
- Property form changes based on property type selected
- HOUSE/APARTMENT: show bedrooms, bathrooms, area
- LAND: show land size, title deed status
- COMMERCIAL: show commercial-specific fields

### 4. Dynamic Sub-Counties
- Update `src/data/kenyanCounties.js` with sub-county data
- County dropdown triggers sub-county dropdown update
- All 47 counties with their respective sub-counties

## Testing

1. **Test Property Display:**
   ```bash
   # Start frontend
   npm run dev
   
   # Visit home page
   # Scroll to "Featured Properties" section
   # Verify properties are displayed correctly
   ```

2. **Test with No Properties:**
   - If no ACTIVE properties exist, you should see "No properties available at the moment."

3. **Test Loading State:**
   - Refresh the page and watch for the loading spinner

## Troubleshooting

### Properties Not Showing
1. Check if properties exist in database:
   ```sql
   SELECT * FROM properties WHERE status = 'ACTIVE';
   ```

2. Check browser console for errors

3. Verify property service is running:
   ```bash
   curl http://localhost:7086/api/properties/active?page=0&size=6
   ```

### Images Not Loading
- The sample SQL uses Unsplash URLs which should work
- For uploaded images, ensure paths are correct: `/uploads/property-images/filename.jpg`
- Check if images column in database has valid JSON array

### Price Not Formatting
- Verify `price` column in database has numeric values
- Check `formatPrice()` function is working correctly
