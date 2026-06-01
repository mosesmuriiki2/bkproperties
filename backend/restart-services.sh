#!/bin/bash

# GlobalHub Services Restart Script
# This script restarts all services in the correct order

echo "=========================================="
echo "GlobalHub Services Restart"
echo "=========================================="

# Kill all existing Java processes
echo "Stopping all services..."
pkill -f "java.*globalhub"
sleep 2

# Build gateway with fixed configuration
echo ""
echo "Building Gateway with fixed configuration..."
cd backend/globalhub-gateway
mvn clean package -DskipTests
cd ../..

echo ""
echo "=========================================="
echo "Services will start in separate terminals"
echo "=========================================="
echo ""
echo "Start these in separate terminals:"
echo ""
echo "Terminal 1 - Eureka (7070):"
echo "java -jar backend/globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar"
echo ""
echo "Terminal 2 - Gateway (9096):"
echo "java -jar backend/globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar"
echo ""
echo "Terminal 3 - Auth Service (7072):"
echo "java -jar backend/globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar"
echo ""
echo "Terminal 4 - Other Services:"
echo "java -jar backend/globalhub-user-service/target/globalhub-user-service-1.0.0-SNAPSHOT.jar"
echo "java -jar backend/globalhub-vendor-service/target/globalhub-vendor-service-1.0.0-SNAPSHOT.jar"
echo "java -jar backend/globalhub-product-service/target/globalhub-product-service-1.0.0-SNAPSHOT.jar"
echo "java -jar backend/globalhub-hotel-service/target/globalhub-hotel-service-1.0.0-SNAPSHOT.jar"
echo "java -jar backend/globalhub-property-service/target/globalhub-property-service-1.0.0-SNAPSHOT.jar"
echo "java -jar backend/globalhub-tour-service/target/globalhub-tour-service-1.0.0-SNAPSHOT.jar"
echo ""
echo "Terminal 5 - Frontend:"
echo "npm run dev"
echo ""
echo "=========================================="
echo "Verify:"
echo "- Eureka: http://localhost:7070"
echo "- Gateway: http://localhost:9096"
echo "- Frontend: http://localhost:5173"
echo "=========================================="
