#!/bin/bash

# GlobalHub Backend - Setup Script for Linux
# This script helps set up all microservices

echo "🚀 GlobalHub Backend Setup"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Java version
echo -e "${BLUE}Checking Java installation...${NC}"
java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "Java version: $java_version"

if [[ ! "$java_version" =~ "17" ]]; then
    echo -e "${RED}Error: Java 17 is required. Current version: $java_version${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Java 17 found${NC}"
echo ""

# Check Maven
echo -e "${BLUE}Checking Maven installation...${NC}"
mvn_version=$(mvn -version 2>&1 | head -1)
echo "$mvn_version"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Maven is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Maven found${NC}"
echo ""

# Create databases (PostgreSQL)
echo -e "${BLUE}Setting up PostgreSQL databases...${NC}"
read -p "Enter PostgreSQL username (default: postgres): " db_user
db_user=${db_user:-postgres}

databases=(
    "globalhub_auth"
    "globalhub_users"
    "globalhub_vendors"
    "globalhub_products"
    "globalhub_hotels"
    "globalhub_properties"
    "globalhub_tours"
    "globalhub_orders"
    "globalhub_payments"
)

for db in "${databases[@]}"; do
    echo "Creating database: $db"
    psql -U "$db_user" -c "CREATE DATABASE $db;" 2>/dev/null || echo "Database $db might already exist"
done

echo -e "${GREEN}✓ Databases created${NC}"
echo ""

# Build all microservices
echo -e "${BLUE}Building all microservices...${NC}"
echo "This may take a few minutes..."
mvn clean install -DskipTests

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}Setup Complete! 🎉${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo "Next steps:"
echo "1. Update application.yml files with your database credentials"
echo "2. Start Eureka Server: cd globalhub-eureka && mvn spring-boot:run"
echo "3. Start API Gateway: cd globalhub-gateway && mvn spring-boot:run"
echo "4. Start individual services in separate terminals"
echo ""
echo "Service Ports:"
echo "  - Eureka Server:     http://localhost:8761"
echo "  - API Gateway:       http://localhost:8080"
echo "  - Auth Service:      http://localhost:8081"
echo "  - User Service:      http://localhost:8082"
echo "  - Vendor Service:    http://localhost:8083"
echo "  - Product Service:   http://localhost:8084"
echo "  - Hotel Service:     http://localhost:8085"
echo "  - Property Service:  http://localhost:8086"
echo "  - Tour Service:      http://localhost:8087"
echo "  - Order Service:     http://localhost:8088"
echo "  - Payment Service:   http://localhost:8089"
echo ""
