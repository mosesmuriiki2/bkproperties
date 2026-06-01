# Quick Fix Reference Card

## 🚨 Quick Fixes Applied

### 1. Documents Not Uploading
```bash
# Create folders
mkdir -p uploads/vendor-documents uploads/property-images
chmod -R 755 uploads

# Fixed in: src/pages/ListProperty.jsx
# Changed: /api/vendors/{id}/documents → /api/vendors/{id}/documents/upload
```

### 2. Vendor Dashboard Empty
```javascript
// Fixed in: src/pages/VendorDashboard.jsx
// Added: fetchVendorByUserId() function
// Now fetches vendor by userId from session storage
```

### 3. Admin Can't See Data
```javascript
// Fixed in: src/pages/AdminDashboard.jsx
// Changed: apiClient.get() → apiClient.vendors.getAll()
// Added: apiClient.vendors.approve() and reject()
```

---

## 🧪 Quick Test Commands

### Test Backend Services
```bash
curl http://localhost:7072/actuator/health  # Auth
curl http://localhost:8084/actuator/health  # Vendor
curl http://localhost:8083/actuator/health  # Property
```

### Test Complete Flow
```bash
./test-complete-vendor-flow.sh
```

### Check Database
```bash
mysql -u root -proot -e "USE globalhub; 
SELECT COUNT(*) as vendors FROM vendors;
SELECT COUNT(*) as properties FROM properties;"
```

### Check Uploads
```bash
ls -la uploads/vendor-documents/
ls -la uploads/property-images/
```

---

## 🔑 Login Credentials

### Super Admin
- URL: `http://localhost:5173/login`
- Email: `superadmin@gmail.com`
- Password: `admin@123`

### Vendor (OTP)
- URL: `http://localhost:5173/vendor-login`
- Email: Your vendor email
- OTP: Check logs with `tail -f backend/globalhub-auth-service/logs/application.log | grep OTP`

---

## 📍 Key URLs

| Page | URL |
|------|-----|
| Home | `http://localhost:5173/` |
| List Property | `http://localhost:5173/list-property` |
| Vendor Login | `http://localhost:5173/vendor-login` |
| Vendor Dashboard | `http://localhost:5173/VendorDashboard` |
| Admin Login | `http://localhost:5173/login` |
| Admin Dashboard | `http://localhost:5173/AdminDashboard` |

---

## 🔧 Quick Debugging

### Browser Console Commands
```javascript
// Clear cache
localStorage.clear();
sessionStorage.clear();
location.reload();

// Check auth data
console.log(localStorage.getItem('accessToken'));
console.log(sessionStorage.getItem('mg_vendor_auth'));
console.log(sessionStorage.getItem('mg_admin_auth'));
```

### Check Logs
```bash
# Auth service (for OTP)
tail -f backend/globalhub-auth-service/logs/application.log | grep OTP

# Vendor service
tail -f backend/globalhub-vendor-service/logs/application.log

# Property service
tail -f backend/globalhub-property-service/logs/application.log
```

### Database Quick Checks
```sql
-- Check vendors
SELECT id, business_name, email, status FROM vendors ORDER BY created_at DESC LIMIT 5;

-- Check properties
SELECT id, vendor_id, title, status FROM properties ORDER BY created_at DESC LIMIT 5;

-- Check documents
SELECT vendor_id, document_type, document_url FROM vendor_documents ORDER BY uploaded_at DESC LIMIT 5;
```

---

## ⚡ Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Documents not uploading | `mkdir -p uploads/vendor-documents && chmod 755 uploads` |
| Vendor dashboard empty | Clear browser cache: `localStorage.clear(); sessionStorage.clear();` |
| Admin can't see vendors | Restart vendor service |
| OTP not working | Check logs: `tail -f backend/globalhub-auth-service/logs/application.log \| grep OTP` |
| Services not responding | Restart all services: `cd backend && ./restart-services.sh` |

---

## 📊 Status Indicators

### Property Status Flow
```
DRAFT → (Admin Approves) → ACTIVE
DRAFT → (Admin Rejects) → INACTIVE
```

### Vendor Status Flow
```
PENDING → (Admin Approves) → APPROVED
PENDING → (Admin Rejects) → REJECTED
```

---

## 🎯 Testing Checklist

Quick checklist for testing:

- [ ] Create vendor via `/list-property`
- [ ] Upload documents (ID + License)
- [ ] Submit property with images
- [ ] Login with OTP at `/vendor-login`
- [ ] See property in vendor dashboard
- [ ] Login as admin
- [ ] See vendor in admin dashboard
- [ ] See property in admin dashboard
- [ ] Approve property
- [ ] See property on homepage

---

## 📞 Emergency Commands

### Restart Everything
```bash
# Stop all
pkill -f "java.*globalhub"

# Start all
cd backend
./restart-services.sh
```

### Reset Database (CAUTION!)
```bash
mysql -u root -proot -e "DROP DATABASE IF EXISTS globalhub; CREATE DATABASE globalhub;"
mysql -u root -proot globalhub < backend/database-schema.sql
```

### Clear All Uploads
```bash
rm -rf uploads/*
mkdir -p uploads/vendor-documents uploads/property-images
chmod -R 755 uploads
```

---

**Quick Reference**: April 30, 2026  
**All Fixes**: ✅ APPLIED  
**Status**: ✅ READY TO TEST

