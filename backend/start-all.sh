#!/bin/bash

# Start All GlobalHub Microservices
# Run this script to start all services

echo "🚀 Starting GlobalHub Microservices"
echo "===================================="
echo ""

# Function to start a service in background
start_service() {
    local service_name=$1
    local service_dir=$2
    
    echo "Starting $service_name..."
    cd "$service_dir"
    mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    echo $! > "../logs/${service_name}.pid"
    cd ..
    echo "✓ $service_name started (PID: $(cat "../logs/${service_name}.pid"))"
}

# Create logs directory
mkdir -p logs

# Start services in order
echo "1. Starting Eureka Server..."
cd globalhub-eureka
mvn spring-boot:run > ../logs/eureka.log 2>&1 &
echo $! > ../logs/eureka.pid
cd ..
echo "   ✓ Eureka Server started"

sleep 5

echo "2. Starting API Gateway..."
cd globalhub-gateway
mvn spring-boot:run > ../logs/gateway.log 2>&1 &
echo $! > ../logs/gateway.pid
cd ..
echo "   ✓ API Gateway started"

sleep 3

echo "3. Starting Business Services..."

# Start all business services in parallel
start_service "auth-service" "globalhub-auth-service"
start_service "user-service" "globalhub-user-service"
start_service "vendor-service" "globalhub-vendor-service"
start_service "product-service" "globalhub-product-service"
start_service "hotel-service" "globalhub-hotel-service"
start_service "property-service" "globalhub-property-service"
start_service "tour-service" "globalhub-tour-service"
start_service "order-service" "globalhub-order-service"
start_service "payment-service" "globalhub-payment-service"
start_service "notification-service" "globalhub-notification-service"

echo ""
echo "===================================="
echo "✅ All services started!"
echo "===================================="
echo ""
echo "Service Status:"
echo "  - Eureka Dashboard: http://localhost:8761"
echo "  - API Gateway:      http://localhost:8080"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo "To view logs: tail -f logs/{service-name}.log"
