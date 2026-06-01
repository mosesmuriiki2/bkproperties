#!/bin/bash

# CORS Fix Verification Script

echo "=========================================="
echo "CORS Fix Verification"
echo "=========================================="
echo ""

# Test 1: Check Eureka
echo "Test 1: Checking Eureka (7070)..."
if curl -s http://localhost:7070 | grep -q "Eureka"; then
    echo "✅ Eureka is running"
else
    echo "❌ Eureka is NOT running"
fi
echo ""

# Test 2: Check Gateway
echo "Test 2: Checking Gateway (9096)..."
if curl -s http://localhost:9096 | grep -q "404\|200"; then
    echo "✅ Gateway is running"
else
    echo "❌ Gateway is NOT running"
fi
echo ""

# Test 3: Check Auth Service
echo "Test 3: Checking Auth Service (7072)..."
if curl -s http://localhost:7072/swagger-ui.html | grep -q "Swagger"; then
    echo "✅ Auth Service is running"
else
    echo "❌ Auth Service is NOT running"
fi
echo ""

# Test 4: Test CORS on Gateway
echo "Test 4: Testing CORS headers on Gateway..."
CORS_HEADER=$(curl -s -i -X OPTIONS http://localhost:9096/api/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control-allow-origin")

if [ ! -z "$CORS_HEADER" ]; then
    echo "✅ CORS headers present:"
    echo "   $CORS_HEADER"
else
    echo "❌ CORS headers NOT present"
fi
echo ""

# Test 5: Test Login via Gateway
echo "Test 5: Testing Login via Gateway (9096)..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:9096/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"consumer@example.com","password":"password"}')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo "✅ Login successful"
    echo "   Response: $LOGIN_RESPONSE"
else
    echo "❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi
echo ""

# Test 6: Test Register via Gateway
echo "Test 6: Testing Register via Gateway (9096)..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:9096/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcors@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "CORS",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "userId\|email"; then
    echo "✅ Registration successful"
    echo "   Response: $REGISTER_RESPONSE"
else
    echo "❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
fi
echo ""

echo "=========================================="
echo "Verification Complete"
echo "=========================================="
echo ""
echo "If all tests passed (✅), CORS is fixed!"
echo "Open http://localhost:5173 and try registering"
echo ""
