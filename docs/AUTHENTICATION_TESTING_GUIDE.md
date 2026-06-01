# Authentication System Testing Guide

## Quick Start

### Prerequisites
1. Backend services running (Eureka, Gateway, Auth Service)
2. Frontend running on `http://localhost:5173` (or your dev server)
3. API Gateway running on `http://localhost:7071`

### Step 1: Start the Application
```bash
# Terminal 1 - Start frontend
npm run dev

# Terminal 2 - Start backend services (if not already running)
cd backend
./build-and-run-all.sh
```

### Step 2: Test Registration

#### Register as Consumer
1. Navigate to `http://localhost:5173/register`
2. Click "Consumer Account"
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +254712345678
   - Password: SecurePass123
   - Confirm Password: SecurePass123
4. Click "Create Account"
5. Should redirect to `/consumer-dashboard`

#### Register as Vendor
1. Navigate to `http://localhost:5173/register`
2. Click "Vendor Account"
3. Fill in personal information:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane.smith@example.com
   - Phone: +254712345679
   - Password: SecurePass123
   - Confirm Password: SecurePass123
4. Click "Next"
5. Fill in business information:
   - Business Name: Smith Enterprises
   - Business Email: business@smith.com
   - Business Phone: +254712345680
   - Business Address: 123 Business St, Nairobi
6. Click "Create Account"
7. Should redirect to `/vendor-dashboard`

### Step 3: Test Login

#### Login as Consumer
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: john.doe@example.com
   - Password: SecurePass123
3. Click "Sign In"
4. Should redirect to `/consumer-dashboard`

#### Login as Vendor
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: jane.smith@example.com
   - Password: SecurePass123
3. Click "Sign In"
4. Should redirect to `/vendor-dashboard`

### Step 4: Test Protected Routes

#### Test Consumer Dashboard Access
1. Login as consumer
2. Try accessing `/vendor-dashboard`
3. Should redirect back to `/consumer-dashboard`

#### Test Vendor Dashboard Access
1. Login as vendor
2. Try accessing `/consumer-dashboard`
3. Should redirect back to `/vendor-dashboard`

#### Test Unauthenticated Access
1. Logout (or clear localStorage)
2. Try accessing `/consumer-dashboard`
3. Should redirect to `/login`

### Step 5: Test Navigation

#### Check User Menu
1. Login as any user
2. Look for user name in top-right corner
3. Click on user menu
4. Should see:
   - Dashboard link
   - Profile link
   - Logout button

#### Check Sign In/Sign Up Buttons
1. Logout or clear localStorage
2. Check top-right corner
3. Should see "Sign In" and "Sign Up" buttons
4. Click "Sign In" → should go to `/login`
5. Click "Sign Up" → should go to `/register`

### Step 6: Test Logout

1. Login as any user
2. Click user menu in top-right
3. Click "Logout"
4. Should redirect to `/login`
5. localStorage should be cleared
6. Trying to access protected routes should redirect to `/login`

## Expected Behavior

### Registration
- ✅ Role selection is required
- ✅ Personal information validation (all fields required)
- ✅ Password must be at least 8 characters
- ✅ Passwords must match
- ✅ Vendor registration requires business information
- ✅ Success redirects to appropriate dashboard
- ✅ Error messages display for validation failures

### Login
- ✅ Email and password are required
- ✅ Invalid credentials show error message
- ✅ Success stores token and user info in localStorage
- ✅ Success redirects to appropriate dashboard based on role
- ✅ 401 errors redirect to login

### Protected Routes
- ✅ Unauthenticated users redirected to `/login`
- ✅ Wrong role redirected to appropriate dashboard
- ✅ Correct role can access dashboard
- ✅ Token is included in API requests

### Navigation
- ✅ Unauthenticated users see "Sign In" and "Sign Up" buttons
- ✅ Authenticated users see user menu with name
- ✅ User menu shows dashboard link for their role
- ✅ Logout clears tokens and redirects to login

## Debugging

### Check localStorage
Open browser DevTools (F12) → Application → Local Storage
Should contain:
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CONSUMER"
  }
}
```

### Check Network Requests
Open browser DevTools → Network tab
- Registration: POST to `/api/auth/register`
- Login: POST to `/api/auth/login`
- API calls: Should include `Authorization: Bearer {token}` header

### Check Console Errors
Open browser DevTools → Console
- Should not show authentication-related errors
- API errors should be logged with details

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/register"
**Cause**: Backend Auth Service not running or Gateway not configured
**Solution**: 
1. Check backend services are running: `docker ps`
2. Check Gateway is routing to Auth Service
3. Check API_BASE_URL in apiClient.js is correct

### Issue: "Invalid credentials"
**Cause**: User doesn't exist or password is wrong
**Solution**:
1. Register a new user first
2. Use exact credentials from registration
3. Check password is case-sensitive

### Issue: "Redirect loop" between login and dashboard
**Cause**: Role mismatch or token validation issue
**Solution**:
1. Clear localStorage and login again
2. Check role returned from API matches expected role
3. Check ProtectedRoute component logic

### Issue: "Token not sent with requests"
**Cause**: getAuthHeaders() not being called or token not in localStorage
**Solution**:
1. Check localStorage has accessToken
2. Check apiClient.js is using getAuthHeaders()
3. Check Authorization header in Network tab

### Issue: "401 error but not redirecting to login"
**Cause**: handleResponse() not checking for 401 status
**Solution**:
1. Check apiClient.js handleResponse() function
2. Verify 401 status check is present
3. Check window.location.href = '/login' is being called

## Test Checklist

- [ ] Register as Consumer
- [ ] Register as Vendor
- [ ] Login as Consumer
- [ ] Login as Vendor
- [ ] Access Consumer Dashboard
- [ ] Access Vendor Dashboard
- [ ] Access Admin Dashboard
- [ ] Try accessing wrong dashboard (should redirect)
- [ ] Try accessing protected route without login (should redirect)
- [ ] Check user menu appears when logged in
- [ ] Check Sign In/Sign Up buttons appear when logged out
- [ ] Logout and verify redirect to login
- [ ] Verify localStorage is cleared after logout
- [ ] Check API requests include Authorization header
- [ ] Test with invalid credentials
- [ ] Test with missing fields
- [ ] Test password validation (< 8 chars)
- [ ] Test password mismatch
- [ ] Test email validation
- [ ] Test role-based redirects

## Performance Testing

### Load Testing
1. Register multiple users
2. Login/logout multiple times
3. Check for memory leaks in DevTools
4. Monitor network requests

### Token Expiration
1. Login as user
2. Wait for token to expire (1 hour)
3. Try making API request
4. Should redirect to login

## Security Testing

### XSS Prevention
1. Try entering `<script>alert('xss')</script>` in registration form
2. Should be escaped/sanitized
3. Should not execute

### CSRF Prevention
1. Check for CSRF tokens in requests
2. Verify same-origin policy is enforced

### Password Security
1. Verify passwords are hashed in backend
2. Verify passwords are not logged
3. Verify passwords are not sent in plain text

## Next Steps

After successful testing:
1. Deploy to staging environment
2. Perform load testing
3. Perform security audit
4. Deploy to production
5. Monitor authentication metrics

## Support

For issues or questions:
1. Check browser console for errors
2. Check Network tab for API responses
3. Check backend logs for server errors
4. Review AUTHENTICATION_ROUTING_COMPLETE.md for detailed documentation
