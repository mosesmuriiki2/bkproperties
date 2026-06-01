#!/bin/bash

set -e

echo "🏗️  Building GlobalHub Property Service Docker Image..."
echo ""

# Step 1: Create upload directories with proper permissions
echo "📁 Creating upload directories..."
./create-upload-dirs.sh

# Step 2: Build the Spring Boot application
echo ""
echo "🔨 Building Spring Boot application with Maven..."
if [ -f "./mvnw" ]; then
    ./mvnw clean package -DskipTests
else
    mvn clean package -DskipTests
fi

# Step 3: Build Docker image
echo ""
echo "🐳 Building Docker image..."
docker build -t globalhub-property-service:latest .

# Step 4: Set proper permissions on uploads directory
echo ""
echo "🔐 Setting permissions on uploads directory..."
chmod -R 777 uploads/

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "To run the service, use one of the following commands:"
echo ""
echo "  Option 1 - Using Docker Compose (recommended):"
echo "    docker-compose up -d"
echo ""
echo "  Option 2 - Using Docker run:"
echo "    docker run -d -p 7086:7086 -v \$(pwd)/uploads:/app/uploads -e SPRING_DATASOURCE_USERNAME=globalhubuser -e SPRING_DATASOURCE_PASSWORD=Ashihundu@2003 --name property-service globalhub-property-service:latest"
echo ""
echo "To view logs:"
echo "    docker-compose logs -f property-service"
echo "    # or"
echo "    docker logs -f property-service"
echo ""
