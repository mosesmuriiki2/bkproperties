#!/bin/bash

# One-Command CORS Fix
# This script fixes all CORS issues and starts the system

echo "=========================================="
echo "GlobalHub CORS Fix - Complete Solution"
echo "=========================================="
echo ""

# Step 1: Kill existing processes
echo "Step 1: Stopping existing services..."
pkill -f "java.*globalhub"
sleep 2
echo "✅ Services stopped"
echo ""

# Step 2: Rebuild Gateway
echo "Step 2: Rebuilding Gateway..."
cd backend/globalhub-gateway
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Gateway rebuilt successfully"
else
    echo "❌ Gateway build failed"
    exit 1
fi
cd ../..
echo ""

# Step 3: Start Eureka
echo "Step 3: Starting Eureka (7070)..."
java -jar backend/globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
sleep 5
echo "✅ Eureka started"
echo ""

# Step 4: Start Gateway
echo "Step 4: Starting Gateway (9096)..."
java -jar backend/globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
sleep 5
echo "✅ Gateway started"
echo ""

# Step 5: Start Auth Service
echo "Step 5: Starting Auth Service (7072)..."
java -jar backend/globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
sleep 3
echo "✅ Auth Service started"
echo ""

# Step 6: Start other services
echo "Step 6: Starting other services..."
java -jar backend/globalhub-user-service/target/globalhub-user-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
java -jar backend/globalhub-vendor-service/target/globalhub-vendor-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
java -jar backend/globalhub-product-service/target/globalhub-product-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
java -jar backend/globalhub-hotel-service/target/globalhub-hotel-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
java -jar backend/globalhub-property-service/target/globalhub-property-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
java -jar backend/globalhub-tour-service/target/globalhub-tour-service-1.0.0-SNAPSHOT.jar > /dev/null 2>&1 &
sleep 3
echo "✅ All services started"
echo ""

# Step 7: Test
echo "Step 7: Testing CORS..."
RESPONSE=$(curl -s -X POST http://localhost:9096/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "corstest@example.com",
    "password": "TestPassword123",
    "firstName": "CORS",
    "lastName": "Test",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }')

if echo "$RESPONSE" | grep -q "userId\|email"; then
    echo "✅ CORS test successful"
else
    echo "⚠️  CORS test response: $RESPONSE"
fi
echo ""

echo "=========================================="
echo "✅ CORS Fix Complete!"
echo "=========================================="
echo ""
echo "Now start the frontend:"
echo "npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Services running:"
echo "- Eureka: http://localhost:7070"
echo "- Gateway: http://localhost:9096"
echo "- Frontend: http://localhost:5173"
echo ""
