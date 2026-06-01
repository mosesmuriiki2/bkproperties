# RUN THIS NOW - CORS Fix

## The Problem
Your frontend can't reach the backend because of CORS errors.

## The Solution
Rebuild the Gateway with the fixed CORS configuration.

## Do This Now (Copy & Paste)

### Step 1: Stop Everything
```bash
pkill -f "java.*globalhub"
sleep 2
```

### Step 2: Rebuild Gateway
```bash
cd backend/globalhub-gateway && mvn clean package -DskipTests && cd ../..
```

### Step 3: Start Services (Open 5 terminals)

**Terminal 1 - Eureka**
```bash
java -jar backend/globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar
```

Wait 5 seconds, then:

**Terminal 2 - Gateway**
```bash
java -jar backend/globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar
```

Wait 5 seconds, then:

**Terminal 3 - Auth Service**
```bash
java -jar backend/globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar
```

**Terminal 4 - Other Services**
```bash
java -jar backend/globalhub-user-service/target/globalhub-user-service-1.0.0-SNAPSHOT.jar &
java -jar backend/globalhub-vendor-service/target/globalhub-vendor-service-1.0.0-SNAPSHOT.jar &
java -jar backend/globalhub-product-service/target/globalhub-product-service-1.0.0-SNAPSHOT.jar &
java -jar backend/globalhub-hotel-service/target/globalhub-hotel-service-1.0.0-SNAPSHOT.jar &
java -jar backend/globalhub-property-service/target/globalhub-property-service-1.0.0-SNAPSHOT.jar &
java -jar backend/globalhub-tour-service/target/globalhub-tour-service-1.0.0-SNAPSHOT.jar &
```

**Terminal 5 - Frontend**
```bash
npm run dev
```

### Step 4: Test It

Open http://localhost:5173 and try to register. It should work now!

## Verify It Works

### Test 1: Check CORS Headers
```bash
curl -i -X OPTIONS http://localhost:9096/api/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

You should see:
```
Access-Control-Allow-Origin: http://localhost:5173
```

### Test 2: Try Registration
```bash
curl -X POST http://localhost:9096/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }'
```

Should return user data (no CORS error).

### Test 3: Frontend
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in the form
4. Click "Register"
5. Should work!

## What Was Fixed

1. ✅ Gateway CORS configuration (YAML key format)
2. ✅ Added explicit CORS filter class
3. ✅ Added all required headers
4. ✅ Added HEAD method

## If It Still Doesn't Work

1. Hard refresh browser: **Ctrl+Shift+R**
2. Clear cache: **Ctrl+Shift+Delete**
3. Check Gateway is running: `lsof -i :9096`
4. Check logs: `tail -f backend/globalhub-gateway/target/logs/app.log`

## Ports

- Frontend: http://localhost:5173
- Gateway: http://localhost:9096 ← This is what frontend uses
- Eureka: http://localhost:7070
- Auth: http://localhost:7072

## Done!

Once you see the registration page working without CORS errors, you're good to go!

---

**Time to fix**: 5-10 minutes  
**Difficulty**: Easy  
**Status**: Ready to implement

