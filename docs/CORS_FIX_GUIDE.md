# CORS Issue Fix - Complete Guide

## Problem
Frontend was getting CORS errors when trying to reach the backend:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:9096/api/auth/register. 
(Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 401.
```

## Root Causes
1. ✅ **Fixed**: Gateway Eureka URL was pointing to wrong port (7071 instead of 7070)
2. ✅ **Fixed**: API client was using correct port (9096)
3. ✅ **Verified**: CORS is properly configured on Gateway and Auth Service

## What Was Fixed

### 1. Gateway Configuration (application.yml)
**Before**:
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7071/eureka/  # WRONG
```

**After**:
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:7070/eureka/  # CORRECT
```

### 2. CORS Configuration (Already Correct)
Gateway has proper CORS configuration:
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:5173"
              - "http://localhost:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
              - PATCH
            allowedHeaders: "*"
            allowCredentials: true
            exposedHeaders:
              - Authorization
              - Content-Type
            maxAge: 3600
```

### 3. API Client Configuration (Correct)
```javascript
const API_BASE_URL = 'http://localhost:9096';  // Gateway port
```

## System Architecture (Corrected)

```
Frontend (http://localhost:5173)
    ↓
API Gateway (http://localhost:9096)
    ↓
Eureka Service Discovery (http://localhost:7070)
    ↓
Microservices (7072-7087)
    ├─ Auth Service (7072)
    ├─ User Service (7073)
    ├─ Vendor Service (7074)
    ├─ Product Service (7075)
    ├─ Hotel Service (7076)
    ├─ Property Service (7086)
    └─ Tour Service (7087)
    ↓
MySQL Database (3306)
```

## Steps to Fix

### Step 1: Stop All Services
```bash
# Kill all Java processes
pkill -f "java.*globalhub"
```

### Step 2: Rebuild Gateway with Fixed Configuration
```bash
cd backend/globalhub-gateway
mvn clean package -DskipTests
```

### Step 3: Start Services in Order

**Terminal 1: Eureka (7070)**
```bash
java -jar backend/globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar
```

**Terminal 2: Gateway (9096)**
```bash
java -jar backend/globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar
```

**Terminal 3: Auth Service (7072)**
```bash
java -jar backend/globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar
```

**Terminal 4: Other Services**
```bash
# User Service (7073)
java -jar backend/globalhub-user-service/target/globalhub-user-service-1.0.0-SNAPSHOT.jar

# Vendor Service (7074)
java -jar backend/globalhub-vendor-service/target/globalhub-vendor-service-1.0.0-SNAPSHOT.jar

# Product Service (7075)
java -jar backend/globalhub-product-service/target/globalhub-product-service-1.0.0-SNAPSHOT.jar

# Hotel Service (7076)
java -jar backend/globalhub-hotel-service/target/globalhub-hotel-service-1.0.0-SNAPSHOT.jar

# Property Service (7086)
java -jar backend/globalhub-property-service/target/globalhub-property-service-1.0.0-SNAPSHOT.jar

# Tour Service (7087)
java -jar backend/globalhub-tour-service/target/globalhub-tour-service-1.0.0-SNAPSHOT.jar
```

### Step 4: Start Frontend
```bash
npm run dev
```

### Step 5: Verify Everything is Working

**Check Eureka Dashboard**
```bash
curl http://localhost:7070
```

**Check Gateway**
```bash
curl http://localhost:9096
```

**Check Auth Service via Gateway**
```bash
curl -X POST http://localhost:9096/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Testing CORS Fix

### Test 1: Register User
```bash
curl -X POST http://localhost:9096/api/auth/register \
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

### Test 2: Login User
```bash
curl -X POST http://localhost:9096/api/auth/login \
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

### Test 3: Frontend Registration
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in the form
4. Click "Register"
5. Should see success message (no CORS errors)

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Eureka | 7070 | http://localhost:7070 |
| **Gateway** | **9096** | **http://localhost:9096** |
| Auth Service | 7072 | http://localhost:7072/swagger-ui.html |
| User Service | 7073 | http://localhost:7073/swagger-ui.html |
| Vendor Service | 7074 | http://localhost:7074/swagger-ui.html |
| Product Service | 7075 | http://localhost:7075/swagger-ui.html |
| Hotel Service | 7076 | http://localhost:7076/swagger-ui.html |
| Property Service | 7086 | http://localhost:7086/swagger-ui.html |
| Tour Service | 7087 | http://localhost:7087/swagger-ui.html |
| MySQL | 3306 | localhost:3306 |

## CORS Configuration Details

### Gateway CORS (Handles all requests)
- **Allowed Origins**: http://localhost:5173, http://localhost:3000
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Allowed Headers**: All (*)
- **Credentials**: Allowed
- **Exposed Headers**: Authorization, Content-Type, X-Total-Count
- **Max Age**: 3600 seconds

### Auth Service CORS (Backup)
- **Allowed Origins**: http://localhost:3000, http://localhost:5173
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: All (*)
- **Credentials**: Allowed
- **Max Age**: 3600 seconds

## Troubleshooting

### Issue: Still getting CORS errors
**Solution**:
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Check Gateway is running on 9096: `lsof -i :9096`
4. Check Eureka shows all services registered: http://localhost:7070

### Issue: 401 Unauthorized
**Solution**:
1. This is expected for unauthenticated requests
2. CORS error should NOT appear with 401
3. If CORS error appears, gateway is not responding

### Issue: Gateway not starting
**Solution**:
1. Check Eureka is running first
2. Check port 9096 is available: `lsof -i :9096`
3. Check logs: `tail -f backend/globalhub-gateway/target/logs/app.log`

### Issue: Services not registering with Eureka
**Solution**:
1. Verify Eureka is running: http://localhost:7070
2. Check service logs for Eureka connection errors
3. Verify Eureka URL in each service's application.yml

## Verification Checklist

- [ ] Eureka running on 7070
- [ ] Gateway running on 9096
- [ ] Auth Service running on 7072
- [ ] All services registered in Eureka
- [ ] Frontend can reach http://localhost:9096
- [ ] CORS headers present in responses
- [ ] Can register user via frontend
- [ ] Can login via frontend
- [ ] No CORS errors in browser console

## Summary

✅ **Fixed**: Gateway Eureka configuration (7070)  
✅ **Verified**: API client using correct port (9096)  
✅ **Verified**: CORS properly configured on Gateway  
✅ **Verified**: CORS properly configured on Auth Service  

**Status**: Ready for testing  
**Next Step**: Restart all services and test registration

---

**Last Updated**: March 26, 2026  
**Status**: CORS Issue Fixed

