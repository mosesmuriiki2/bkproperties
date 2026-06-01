# Authentication and Routing Guide

## Overview
This guide explains the complete authentication flow and routing system for GlobalHub with role-based access control for SuperAdmin, Vendors, and Normal Users.

## User Roles

### 1. CONSUMER (Normal User)
- **Description**: Regular users who browse and book services
- **Dashboard**: Consumer Dashboard
- **Permissions**:
  - Browse hotels, tours, properties, products
  - Make bookings and purchases
  - View personal bookings and wishlist
  - Manage profile and addresses
  - View order history

### 2. VENDOR
- **Description**: Business owners who sell products/services
- **Dashboard**: Vendor Dashboard
- **Permissions**:
  - Add and manage products
  - View orders and sales
  - Manage inventory
  - View analytics and revenue
  - Manage business information
  - Respond to customer inquiries

### 3. ADMIN (SuperAdmin)
- **Description**: Platform administrators with full control
- **Dashboard**: Admin Dashboard
- **Permissions**:
  - Manage all users
  - Approve/reject vendors
  - View platform analytics
  - Monitor system health
  - Manage orders and disputes
  - Generate reports

---

## Authentication Flow

### Registration Flow

#### Step 1: Role Selection
User selects account type:
- Consumer Account
- Vendor Account

#### Step 2: Personal Information
User enters:
- First Name
- Last Name
- Email
- Phone Number
- Password (min 8 characters)
- Confirm Password

#### Step 3: Business Information (Vendor Only)
Vendor enters:
- Business Name
- Business Email
- Business Phone
- Business Address

#### Step 4: Account Creation
- User data is sent to Auth Service
- Password is hashed with BCrypt
- User is created with appropriate role
- JWT tokens are generated
- User is redirected to appropriate dashboard

### Login Flow

1. User enters email and password
2. Auth Service validates credentials
3. If valid:
   - JWT access token is generated
   - Refresh token is generated
   - User data is stored in localStorage
   - User is redirected based on role
4. If invalid:
   - Error message is displayed
   - User remains on login page

### Token Management

**Access Token**:
- Expiration: 1 hour
- Used for API requests
- Stored in localStorage
- Included in Authorization header

**Refresh Token**:
- Expiration: 7 days
- Used to get new access token
- Stored in localStorage
- Sent when access token expires

---

## Routing Structure

### Public Routes
```
/login                    - Login page
/register                 - Registration page
/forgot-password          - Password recovery
/home                     - Home page
/hotels                   - Hotels listing
/cars                     - Cars/Tours listing
/properties               - Properties listing
/tours                    - Tours listing
```

### Protected Routes (Consumer)
```
/consumer-dashboard       - Consumer dashboard (CONSUMER role)
/profile                  - User profile
/bookings                 - My bookings
/wishlist                 - Saved items
/settings                 - Account settings
```

### Protected Routes (Vendor)
```
/vendor-dashboard         - Vendor dashboard (VENDOR role)
/products                 - Manage products
/orders                   - View orders
/analytics                - Sales analytics
/settings                 - Business settings
```

### Protected Routes (Admin)
```
/admin-dashboard          - Admin dashboard (ADMIN role)
/users                    - User management
/vendors                  - Vendor management
/orders                   - Order management
/analytics                - Platform analytics
/system-health            - System monitoring
```

---

## Implementation in App.jsx

```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Hotels from "@/pages/Hotels";
import Cars from "@/pages/Cars";
import Properties from "@/pages/Properties";
import Tours from "@/pages/Tours";

// Protected Pages
import ConsumerDashboard from "@/pages/ConsumerDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

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

---

## API Integration

### Auth Endpoints

**Register**
```javascript
POST /api/auth/register
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  role: "CONSUMER" | "VENDOR",
  businessName?: string,
  businessEmail?: string,
  businessPhone?: string,
  businessAddress?: string
}

Response:
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  accessToken: string,
  refreshToken: string,
  message: string
}
```

**Login**
```javascript
POST /api/auth/login
{
  email: string,
  password: string
}

Response:
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  accessToken: string,
  refreshToken: string,
  message: string
}
```

**Refresh Token**
```javascript
POST /api/auth/refresh?refreshToken=TOKEN
Authorization: Bearer ACCESS_TOKEN

Response:
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  accessToken: string,
  refreshToken: string,
  message: string
}
```

**Validate Token**
```javascript
POST /api/auth/validate?token=TOKEN
Authorization: Bearer TOKEN

Response:
{
  userId: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  message: string
}
```

---

## localStorage Structure

### User Data
```javascript
{
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  role: "CONSUMER" | "VENDOR" | "ADMIN"
}
```

### Tokens
```javascript
localStorage.setItem("accessToken", token);
localStorage.setItem("refreshToken", token);
```

---

## Error Handling

### 401 Unauthorized
- Token expired or invalid
- User is redirected to login
- localStorage is cleared

### 403 Forbidden
- User doesn't have permission
- User is redirected to appropriate dashboard

### 404 Not Found
- Resource doesn't exist
- Error message is displayed

### 500 Server Error
- Backend error
- Error message is displayed

---

## Security Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - Should contain uppercase, lowercase, numbers, special characters
   - Never stored in plain text

2. **Token Security**
   - Tokens stored in localStorage (consider using httpOnly cookies for production)
   - Tokens included in Authorization header
   - Tokens validated on every request

3. **CORS Configuration**
   - Frontend origins: localhost:3000, localhost:5173
   - Allowed methods: GET, POST, PUT, DELETE, OPTIONS
   - Allowed headers: Content-Type, Authorization

4. **Input Validation**
   - Email format validation
   - Password strength validation
   - Required field validation
   - XSS prevention

---

## Testing Credentials

### Consumer Account
```
Email: consumer@example.com
Password: Password123!
```

### Vendor Account
```
Email: vendor@example.com
Password: Password123!
```

### Admin Account
```
Email: admin@example.com
Password: Password123!
```

---

## Logout Flow

1. User clicks logout button
2. localStorage is cleared
3. User is redirected to login page
4. Session is terminated

---

## Session Management

### Session Timeout
- Access token expires after 1 hour
- Refresh token expires after 7 days
- User is prompted to login again after session expires

### Remember Me
- Optional feature to keep user logged in
- Extends session duration
- Stores refresh token for automatic renewal

---

## Role-Based Access Control (RBAC)

### Middleware Implementation
```javascript
// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const user = localStorage.getItem("user");
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(user);
  
  if (requiredRole && userData.role !== requiredRole) {
    // Redirect to appropriate dashboard
    switch (userData.role) {
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      case "VENDOR":
        return <Navigate to="/vendor-dashboard" replace />;
      case "CONSUMER":
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return children;
}
```

---

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS verification
   - Email verification
   - Authenticator app support

2. **Social Login**
   - Google OAuth
   - Facebook OAuth
   - Apple Sign-In

3. **Advanced Security**
   - Rate limiting
   - IP whitelisting
   - Device fingerprinting
   - Suspicious activity detection

4. **Session Management**
   - Multiple device login
   - Session history
   - Device management
   - Remote logout

5. **Audit Logging**
   - Login/logout tracking
   - Action logging
   - Security event logging
   - Compliance reporting

---

## Troubleshooting

### User Can't Login
- Check email and password
- Verify account is active
- Check if account is verified
- Clear browser cache and cookies

### Token Expired
- Refresh token automatically
- Prompt user to login again
- Clear localStorage

### Role-Based Access Denied
- Verify user role
- Check route protection
- Verify permissions
- Contact admin if needed

### Session Issues
- Clear localStorage
- Clear browser cookies
- Restart browser
- Try incognito mode

---

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check browser console for errors
4. Contact support team
