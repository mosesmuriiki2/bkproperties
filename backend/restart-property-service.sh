#!/bin/bash

echo "=========================================="
echo "Restarting Property Service"
echo "=========================================="

# Navigate to property service directory
cd "$(dirname "$0")/globalhub-property-service" || exit 1

# Kill any existing property service process
echo "Stopping existing property service..."
pkill -f "globalhub-property-service" || true
sleep 2

# Clean and rebuild
echo "Cleaning and rebuilding..."
mvn clean install -DskipTests

# Start the service
echo "Starting property service on port 7086..."
mvn spring-boot:run &

# Wait for service to start
echo "Waiting for service to start..."
sleep 10

# Check if service is running
if curl -s http://localhost:7086/actuator/health > /dev/null 2>&1; then
    echo "✅ Property service started successfully on port 7086"
else
    echo "⚠️  Property service may still be starting... Check logs"
fi

echo "=========================================="
echo "Property Service Restart Complete"
echo "=========================================="
