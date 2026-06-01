# Priority Implementation Summary

## Current Status
✅ Properties can be created by vendors
✅ Admin can approve properties
❌ Approved properties NOT showing on home page
❌ No inquiry system
❌ No vendor registration page
❌ Form is not dynamic based on property type
❌ Sub-counties are not dynamic

## PRIORITY 1: Show Approved Properties on Home Page

### What's needed:
1. Update Home.jsx to fetch and display active properties
2. Add property cards with images
3. Add "Inquire" button on each property

### Quick Fix:
The home page needs to call `/api/properties/active` endpoint which already exists in the backend.

## PRIORITY 2: Property Inquiry System

### Backend (NEW):
- Create PropertyInquiry entity, repository, service, controller
- Add endpoints: POST /api/inquiries, GET /api/inquiries/property/{id}, GET /api/inquiries/vendor/{vendorId}

### Frontend:
- Create inquiry form modal
- Add to property detail view
- Show inquiries in VendorDashboard
- Show inquiries in AdminDashboard

## PRIORITY 3: Vendor Registration

### What exists:
- ListProperty.jsx has vendor registration in step 1
- Creates user + vendor in one flow

### What's needed:
- Separate "Apply to Become Vendor" page
- Admin approval before vendor can login
- Vendor status: PENDING → APPROVED → Can login

## PRIORITY 4: Dynamic Property Form

### Current: All fields shown for all property types
### Needed: Show/hide fields based on propertyType

**HOUSE/APARTMENT:**
- bedrooms ✓
- bathrooms ✓
- areaSqm ✓

**LAND:**
- landSizeSqm ✓
- Hide: bedrooms, bathrooms

**COMMERCIAL:**
- areaSqm ✓
- Add: parkingSpaces
- Hide: bedrooms, bathrooms

## PRIORITY 5: Dynamic Sub-Counties

### Current: Manual text input
### Needed: Dropdown that changes based on county

Already have: `src/data/kenyanCounties.js` with counties
Need: Add sub-counties data for each county

## Recommended Implementation Order

1. **Show properties on home (30 min)** - Immediate value
2. **Dynamic sub-counties (20 min)** - Easy win
3. **Dynamic form fields (30 min)** - Better UX
4. **Inquiry system (2 hours)** - Backend + Frontend
5. **Vendor registration (1 hour)** - Separate flow

## Quick Wins (Can do now)

### 1. Home Page Properties (Fastest)
Just update Home.jsx to fetch from `/api/properties/active`

### 2. Dynamic Sub-Counties (Easy)
Update kenyanCounties.js with sub-county data and add dropdown logic

### 3. Dynamic Form (Medium)
Add conditional rendering in VendorDashboard based on propertyType

---

**Which priority would you like me to implement first?**

I recommend starting with #1 (Home Page) since you mentioned you can't see approved properties there.
