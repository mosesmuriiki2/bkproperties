# Authentication Quick Start Guide

## 5-Minute Setup

### 1. Update App.jsx

Add these routes to your main `App.jsx`:

```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Dashboards
import ConsumerDashboard from "@/pages/ConsumerDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

// Marketplace Pages
import Home from "@/pages/Home";
import Hotels from "@/pages/Hotels";
import Cars from "@/pages/Cars";
import Properties from "@/pages/Properties";
import Tours from "@/pages/Tours";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tours" element={<Tours />} />

        {/* Protected Routes */}
        <Route
          path="/consumer-dashboard"
          element={
            <ProtectedRoute requiredRole="CONSUMER">
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute requiredRole="VENDOR">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Add Navigation Links

Update your Home page or Navigation component to include:

```javascript
import { Link } from "react-router-dom";

export default function Navigation() {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  return (
    <nav className="flex gap-4">
      {!userData ? (
        <>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <span>Welcome, {userData.firstName}</span>
          {userData.role === "CONSUMER" && (
            <Link to="/consumer-dashboard">Dashboard</Link>
          )}
          {userData.role === "VENDOR" && (
            <Link to="/vendor-dashboard">Dashboard</Link>
          )}
          {userData.role === "ADMIN" && (
            <Link to="/admin-dashboard">Dashboard</Link>
          )}
          <button onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
```

### 3. Test the System

#### Register as Consumer
1. Go to http://localhost:5173/register
2. Select "Consumer Account"
3. Fill in personal information
4. Click "Create Account"
5. You'll be redirected to Consumer Dashboard

#### Register as Vendor
1. Go to http://localhost:5173/register
2. Select "Vendor Account"
3. Fill in personal information
4. Fill in business information
5. Click "Create Account"
6. You'll be redirected to Vendor Dashboard

#### Login
1. Go to http://localhost:5173/login
2. Use demo credentials:
   - Consumer: consumer@example.com / Password123!
   - Vendor: vendor@example.com / Password123!
   - Admin: admin@example.com / Password123!
3. You'll be redirected to appropriate dashboard

### 4. Test Protected Routes

Try accessing protected routes without logging in:
- http://localhost:5173/consumer-dashboard → Redirects to login
- http://localhost:5173/vendor-dashboard → Redirects to login
- http://localhost:5173/admin-dashboard → Redirects to login

Try accessing with wrong role:
- Login as Consumer, try to access /vendor-dashboard → Redirects to /consumer-dashboard

---

## API Endpoints

### Register
```bash
curl -X POST http://localhost:7071/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }'
```

### Login
```bash
curl -X POST http://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "consumer@example.com",
    "password": "Password123!"
  }'
```

### Refresh Token
```bash
curl -X POST "http://localhost:7071/api/auth/refresh?refreshToken=YOUR_REFRESH_TOKEN" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Validate Token
```bash
curl -X POST "http://localhost:7071/api/auth/validate?token=YOUR_ACCESS_TOKEN" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## File Structure

```
src/
├── pages/
│   ├── Login.jsx                    (Login page)
│   ├── Register.jsx                 (Registration page)
│   ├── ConsumerDashboard.jsx        (Consumer dashboard)
│   ├── VendorDashboard.jsx          (Vendor dashboard)
│   ├── AdminDashboard.jsx           (Admin dashboard)
│   ├── Home.jsx                     (Home page)
│   ├── Hotels.jsx                   (Hotels marketplace)
│   ├── Cars.jsx                     (Tours/Cars marketplace)
│   ├── Properties.jsx               (Properties marketplace)
│   └── Tours.jsx                    (Tours marketplace)
│
├── components/
│   └── ProtectedRoute.jsx           (Route protection component)
│
└── api/
    └── apiClient.js                 (API client with JWT handling)
```

---

## localStorage Structure

After login, the following data is stored:

```javascript
// User data
localStorage.getItem("user")
// Returns: {"id": 1, "email": "user@example.com", "firstName": "John", "lastName": "Doe", "role": "CONSUMER"}

// Access token
localStorage.getItem("accessToken")
// Returns: "eyJhbGciOiJIUzUxMiJ9..."

// Refresh token (optional)
localStorage.getItem("refreshToken")
// Returns: "eyJhbGciOiJIUzUxMiJ9..."
```

---

## Common Issues & Solutions

### Issue: "Email already registered"
**Solution**: Use a different email address or login with existing account

### Issue: "Passwords do not match"
**Solution**: Ensure both password fields are identical

### Issue: "Password must be at least 8 characters"
**Solution**: Use a password with at least 8 characters

### Issue: "Invalid email or password"
**Solution**: Check email and password are correct

### Issue: "Unauthorized" error
**Solution**: Token may have expired, login again

### Issue: "Access Denied" when accessing dashboard
**Solution**: You don't have permission for that role, login with correct account

### Issue: Redirected to login after page refresh
**Solution**: This is normal, tokens are stored in localStorage and will be used on next request

---

## User Roles

### CONSUMER
- Can browse marketplace
- Can make bookings
- Can view personal bookings
- Can manage profile
- Access: /consumer-dashboard

### VENDOR
- Can add products
- Can manage orders
- Can view analytics
- Can manage business info
- Access: /vendor-dashboard

### ADMIN
- Can manage users
- Can approve vendors
- Can view analytics
- Can monitor system
- Access: /admin-dashboard

---

## Next Steps

1. ✅ Update App.jsx with routes
2. ✅ Add navigation links
3. ✅ Test registration and login
4. ⏳ Connect dashboards to API endpoints
5. ⏳ Implement email verification
6. ⏳ Add password reset functionality
7. ⏳ Implement two-factor authentication

---

## Support

For detailed information, see:
- AUTHENTICATION_AND_ROUTING_GUIDE.md
- AUTHENTICATION_IMPLEMENTATION_COMPLETE.md
- COMPLETE_SETUP_GUIDE.md

---

**You're all set! Start by updating App.jsx and testing the authentication system.**
