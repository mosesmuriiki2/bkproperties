#!/bin/bash

# NiaHubX - Build All Services Script
# This script builds all backend microservices

set -e

echo "=========================================="
echo "NiaHubX - Building All Services"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to build a service
build_service() {
    local service_name=$1
    local service_path=$2
    
    echo -e "${BLUE}Building ${service_name}...${NC}"
    cd "$service_path"
    
    if mvn clean package -DskipTests; then
        echo -e "${GREEN}✓ ${service_name} built successfully${NC}"
    else
        echo -e "${RED}✗ ${service_name} build failed${NC}"
        exit 1
    fi
    
    cd - > /dev/null
    echo ""
}

# Navigate to backend directory
cd backend

# Build services
build_service "Eureka Service Discovery" "globalhub-eureka"
build_service "API Gateway" "globalhub-gateway"
build_service "Auth Service" "globalhub-auth-service"
build_service "Property Service" "globalhub-property-service"
build_service "Vendor Service" "globalhub-vendor-service"

# Return to root
cd ..

echo "=========================================="
echo -e "${GREEN}All services built successfully!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Build Docker images: docker-compose build"
echo "2. Start services: docker-compose up -d"
echo "3. Check status: docker-compose ps"
echo ""
