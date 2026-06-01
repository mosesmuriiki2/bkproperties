# GlobalHub Quick Test Guide

## 5-Minute System Verification

### Step 1: Verify All Services Are Running (1 minute)

**Check Frontend**
```bash
curl -s http://localhost:5173 | grep -q "Base44 APP" && echo "✅ Frontend running" || echo "❌ Frontend not running"
```

**Check Gateway**
```bash
curl -s http://localhost:7071/api/auth/validate -X POST -H "Content-Type: application/json" -d '{}' | grep -q "error" && echo "✅ Gateway running" || echo "❌ Gateway not running"
```

**Check Eureka**
```bash
curl -s http://localhost:7070 | grep -q "Eureka" && echo "✅ Eureka running" || echo "❌ Eureka not running"
```

---

### Step 2: Test User Registration (2 minutes)

**Register a new user**
```bash
curl -X POST http://localhost:7071/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }'
```

**Expected Response**:
```json
{
  "userId": 1,
  "email": "testuser@example.com",
  "role": "CONSUMER",
  "message": "User registered successfully"
}
```

---

### Step 3: Test User Login (1 minute)

**Login with the registered user**
```bash
curl -X POST http://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123"
  }'
```

**Expected Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "testuser@example.com",
  "role": "CONSUMER"
}
```

**Save the token** (you'll need it for the next step):
```bash
TOKEN="your_token_here"
```

---

### Step 4: Test Protected API Endpoint (1 minute)

**Get user profile (requires authentication)**
```bash
curl -X GET http://localhost:7071/api/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:
```json
{
  "userId": 1,
  "email": "testuser@example.com",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+254712345678",
  "role": "CONSUMER"
}
```

---

### Step 5: Test Frontend UI (Optional)

1. Open http://localhost:5173 in your browser
2. Click "Sign Up"
3. Fill in the registration form:
   - Email: testuser2@example.com
   - Password: TestPassword123
   - First Name: Test
   - Last Name: User
   - Phone: +254712345678
   - Role: Consumer
4. Click "Register"
5. Login with your credentials
6. You should see the Consumer Dashboard

---

## Full Test Checklist

### Authentication Tests
- [ ] Register as Consumer
- [ ] Register as Vendor
- [ ] Register as Admin
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Access protected route without token (should redirect to login)
- [ ] Access protected route with valid token (should work)
- [ ] Logout functionality works

### API Tests
- [ ] GET /api/hotels (list hotels)
- [ ] GET /api/properties (list properties)
- [ ] GET /api/tours (list tours)
- [ ] GET /api/products (list products)
- [ ] POST /api/hotels/bookings (create booking)
- [ ] GET /api/users/{userId} (get user profile)
- [ ] PUT /api/users/{userId} (update user profile)

### Frontend Tests
- [ ] Home page loads
- [ ] Login page works
- [ ] Register page works
- [ ] Consumer Dashboard loads
- [ ] Vendor Dashboard loads
- [ ] Admin Dashboard loads
- [ ] Hotels page loads
- [ ] Properties page loads
- [ ] Tours page loads
- [ ] Navigation menu works
- [ ] Logout works

### Database Tests
- [ ] MySQL is running
- [ ] All 7 databases exist
- [ ] All 13 tables exist
- [ ] User data is persisted
- [ ] Relationships are intact

---

## Common Test Scenarios

### Scenario 1: Complete User Journey
1. Register as Consumer
2. Login
3. Browse Hotels
4. View Hotel Details
5. Make a Booking
6. View Booking in Profile
7. Logout

### Scenario 2: Vendor Workflow
1. Register as Vendor
2. Login to Vendor Dashboard
3. Add Products
4. View Sales Analytics
5. Manage Orders
6. Logout

### Scenario 3: Admin Workflow
1. Register as Admin
2. Login to Admin Dashboard
3. View All Users
4. View All Vendors
5. View Platform Analytics
6. Logout

---

## Performance Testing

### Response Time Test
```bash
# Measure API response time
time curl -X GET http://localhost:7071/api/hotels \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: < 500ms

### Load Test (using Apache Bench)
```bash
# Install Apache Bench (if not installed)
sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:7071/api/hotels
```

**Expected**: 
- Requests per second: > 100
- Failed requests: 0

---

## Debugging Tips

### Check Service Logs
```bash
# Auth Service logs
tail -f backend/globalhub-auth-service/target/logs/app.log

# Gateway logs
tail -f backend/globalhub-gateway/target/logs/app.log

# All service logs
tail -f backend/*/target/logs/app.log
```

### Check Database
```bash
# Connect to MySQL
mysql -u root -p

# Check databases
SHOW DATABASES LIKE 'globalhub%';

# Check tables in auth database
USE globalhub_auth;
SHOW TABLES;

# Check users
SELECT * FROM users;
```

### Check Service Health
```bash
# Eureka Dashboard
curl http://localhost:7070

# Gateway Health
curl http://localhost:7071/actuator/health

# Auth Service Health
curl http://localhost:7072/actuator/health
```

---

## Troubleshooting

### Issue: "Connection refused" on port 7071
**Solution**: 
1. Check if Gateway is running: `ps aux | grep gateway`
2. Check if port is in use: `lsof -i :7071`
3. Restart Gateway service

### Issue: "401 Unauthorized" on protected endpoints
**Solution**:
1. Ensure token is included in Authorization header
2. Check token format: `Bearer <token>`
3. Login again to get fresh token
4. Check token hasn't expired

### Issue: "Cannot connect to database"
**Solution**:
1. Check MySQL is running: `mysql -u root -p`
2. Check credentials in application.yml
3. Verify databases exist: `SHOW DATABASES;`
4. Check MySQL user permissions

### Issue: Frontend shows "Proxy not enabled"
**Solution**: This is normal! Frontend uses custom API client, not Base44 proxy. No action needed.

---

## Success Criteria

✅ All services are running  
✅ User registration works  
✅ User login works  
✅ Protected endpoints require authentication  
✅ Frontend loads and displays pages  
✅ API endpoints return data  
✅ Database persists data  
✅ Role-based routing works  
✅ Logout functionality works  
✅ Error handling works  

---

## Next Steps

1. ✅ Run this quick test guide
2. ✅ Verify all success criteria are met
3. ✅ Run full test checklist
4. ✅ Test performance
5. ✅ Review logs for any errors
6. ✅ Prepare for production deployment

---

**Test Duration**: ~5 minutes  
**Difficulty**: Easy  
**Prerequisites**: All services running, curl installed

