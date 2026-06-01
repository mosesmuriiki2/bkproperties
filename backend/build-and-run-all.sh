#!/bin/bash

echo "🚀 Building and Starting All GlobalHub Microservices"
echo "===================================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Step 1: Build all microservices
echo "📦 Step 1: Building all microservices..."
mvn clean install-DskipTests

if [ $? -ne 0 ]; then
   echo "❌ Build failed! Please check for compilation errors."
   exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Create logs directory
mkdir -p logs

# Step 3: Start Eureka Server first
echo "🔧 Step 2: Starting Eureka Server..."
cd globalhub-eureka
nohup mvn spring-boot:run > ../logs/eureka.log 2>&1 &
EUREKA_PID=$!
echo $EUREKA_PID > ../logs/eureka.pid
cd ..
echo "   ✓ Eureka Server started (PID: $EUREKA_PID)"
echo ""

# Wait for Eureka to start
echo "⏳ Waiting for Eureka Server to be ready (30 seconds)..."
sleep 30

# Check if Eureka is running
if curl -s http://localhost:8761 > /dev/null 2>&1; then
   echo "✅ Eureka Server is ready!"
else
   echo "⚠️  Eureka Server may not be fully ready yet, continuing anyway..."
fi
echo ""

# Step 4: Start API Gateway
echo "🔧 Step 3: Starting API Gateway..."
cd globalhub-gateway
nohup mvn spring-boot:run > ../logs/gateway.log 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > ../logs/gateway.pid
cd ..
echo "   ✓ API Gateway started (PID: $GATEWAY_PID)"
echo ""

# Wait for Gateway
sleep 10

# Step 5: Start all business services in parallel
echo "🔧 Step 4: Starting business microservices..."

services=(
    "globalhub-auth-service:Auth Service"
    "globalhub-user-service:User Service"
    "globalhub-vendor-service:Vendor Service"
    "globalhub-product-service:Product Service"
    "globalhub-hotel-service:Hotel Service"
    "globalhub-property-service:Property Service"
    "globalhub-tour-service:Tour Service"
    "globalhub-order-service:Order Service"
    "globalhub-payment-service:Payment Service"
    "globalhub-notification-service:Notification Service"
)

for service_info in "${services[@]}"; do
    IFS=':' read -r dir name <<< "$service_info"
    
    if [ -d "$dir" ]; then
       echo "   Starting $name..."
       cd $dir
        nohup mvn spring-boot:run > ../logs/${dir}.log 2>&1 &
        SERVICE_PID=$!
       echo $SERVICE_PID > ../logs/${dir}.pid
       cd ..
       echo "      ✓ $name started (PID: $SERVICE_PID)"
    else
       echo "      ⚠️  $dir not found, skipping..."
    fi
done

echo ""

# Wait for services to register
echo "⏳ Waiting for services to register with Eureka (30 seconds)..."
sleep 30

# Step 6: Check Eureka for registered services
echo ""
echo "📊 Step 5: Checking registered services..."
echo ""

# Try to get registered services from Eureka
REGISTERED=$(curl -s http://localhost:8761/eureka/apps 2>/dev/null | grep -o "<application>[^<]*</application>" | wc -l)

if [ "$REGISTERED" -gt 0 ]; then
   echo "✅ Successfully connected to Eureka!"
   echo "   Registered applications: $REGISTERED"
   echo ""
   echo "📋 Registered Services:"
    curl -s http://localhost:8761/eureka/apps 2>/dev/null | \
        grep -o "<application>[^<]*</application>" | \
       sed 's/<application>/   - /g' | \
       sed 's/<\/application>//g'
else
   echo "⚠️  Could not retrieve service list from Eureka"
   echo "   Services may still be starting up..."
fi

echo ""
echo "===================================================="
echo "✅ All services started!"
echo "===================================================="
echo ""
echo "🌐 Access Points:"
echo "   • Frontend (React):     http://localhost:5173"
echo "   • API Gateway:          http://localhost:8080"
echo "   • Eureka Dashboard:     http://localhost:8761"
echo ""
echo "📝 Swagger Documentation:"
echo "   • Auth Service:         http://localhost:8081/swagger-ui.html"
echo "   • User Service:         http://localhost:8082/swagger-ui.html"
echo "   • Vendor Service:       http://localhost:8083/swagger-ui.html"
echo "   • Product Service:      http://localhost:8084/swagger-ui.html"
echo "   • Hotel Service:        http://localhost:8085/swagger-ui.html"
echo "   • Property Service:     http://localhost:8086/swagger-ui.html"
echo "   • Tour Service:         http://localhost:8087/swagger-ui.html"
echo "   • Order Service:        http://localhost:8088/swagger-ui.html"
echo "   • Payment Service:      http://localhost:8089/swagger-ui.html"
echo "   • Notification Service: http://localhost:8090/swagger-ui.html"
echo ""
echo "📋 Service Ports:"
echo "   8761 - Eureka Server"
echo "   8080 - API Gateway"
echo "  8081 - Auth Service"
echo "   8082 - User Service"
echo "   8083 - Vendor Service"
echo "   8084 - Product Service"
echo "  8085 - Hotel Service"
echo "   8086 - Property Service"
echo "   8087 - Tour Service"
echo "   8088 - Order Service"
echo "  8089 - Payment Service"
echo "   8090 - Notification Service"
echo ""
echo "🛑 To stop all services, run:"
echo "   ./stop-all.sh"
echo ""
echo "📄 View logs:"
echo "   tail -f logs/{service-name}.log"
echo ""
