#!/bin/bash

# Quick CORS Fix Script
# This script rebuilds the gateway and tests CORS

echo "=========================================="
echo "Quick CORS Fix"
echo "=========================================="
echo ""

# Step 1: Kill existing services
echo "Step 1: Stopping existing services..."
pkill -f "java.*globalhub"
sleep 2
echo "✅ Services stopped"
echo ""

# Step 2: Rebuild Gateway
echo "Step 2: Rebuilding Gateway with CORS fix..."
cd backend/globalhub-gateway
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Gateway built successfully"
else
    echo "❌ Gateway build failed"
    exit 1
fi
cd ../..
echo ""

# Step 3: Start Eureka
echo "Step 3: Starting Eureka (7070)..."
java -jar backend/globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
EUREKA_PID=$!
sleep 5
echo "✅ Eureka started (PID: $EUREKA_PID)"
echo ""

# Step 4: Start Gateway
echo "Step 4: Starting Gateway (9096)..."
java -jar backend/globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
GATEWAY_PID=$!
sleep 5
echo "✅ Gateway started (PID: $GATEWAY_PID)"
echo ""

# Step 5: Start Auth Service
echo "Step 5: Starting Auth Service (7072)..."
java -jar backend/globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
AUTH_PID=$!
sleep 3
echo "✅ Auth Service started (PID: $AUTH_PID)"
echo ""

# Step 6: Test CORS
echo "Step 6: Testing CORS..."
echo ""

# Test preflight
echo "Testing CORS preflight request..."
PREFLIGHT=$(curl -s -i -X OPTIONS http://localhost:9096/api/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" | grep -i "access-control-allow-origin")

if [ ! -z "$PREFLIGHT" ]; then
    echo "✅ CORS preflight successful"
    echo "   $PREFLIGHT"
else
    echo "❌ CORS preflight failed"
fi
echo ""

# Test registration
echo "Testing registration endpoint..."
REGISTER=$(curl -s -X POST http://localhost:9096/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "corstest@example.com",
    "password": "TestPassword123",
    "firstName": "CORS",
    "lastName": "Test",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }')

if echo "$REGISTER" | grep -q "userId\|email"; then
    echo "✅ Registration successful"
    echo "   Response: $REGISTER"
else
    echo "⚠️  Registration response: $REGISTER"
fi
echo ""

echo "=========================================="
echo "CORS Fix Complete!"
echo "=========================================="
echo ""
echo "Services running:"
echo "- Eureka: http://localhost:7070"
echo "- Gateway: http://localhost:9096"
echo "- Auth Service: http://localhost:7072"
echo ""
echo "Next steps:"
echo "1. Start other services (User, Vendor, Product, Hotel, Property, Tour)"
echo "2. Start frontend: npm run dev"
echo "3. Open http://localhost:5173"
echo "4. Try registering a new account"
echo ""
echo "To stop services:"
echo "pkill -f 'java.*globalhub'"
echo ""
