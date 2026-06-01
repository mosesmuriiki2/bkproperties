#!/bin/bash

# NiaHubX Docker Quick Start Script
# Complete deployment in one command

set -e

echo "=========================================="
echo "NiaHubX Docker Quick Start"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    exit 1
fi

echo "✓ Docker is running"
echo "✓ Docker Compose is available"
echo ""

# Step 1: Build backend services
echo "📦 Step 1: Building backend services..."
if [ -f "build-all-services.sh" ]; then
    bash build-all-services.sh
else
    echo "⚠️  build-all-services.sh not found, skipping backend build"
fi

# Step 2: Build frontend
echo "📦 Step 2: Building frontend..."
cd frontend
if [ -f "package.json" ]; then
    npm install
    npm run build
    echo "✓ Frontend built successfully"
else
    echo "⚠️  package.json not found in frontend/"
fi
cd ..

# Step 3: Build Docker images
echo "🐳 Step 3: Building Docker images..."
docker-compose build

# Step 4: Start services
echo "🚀 Step 4: Starting services..."
docker-compose up -d

# Step 5: Wait for services to be healthy
echo "⏳ Step 5: Waiting for services to be healthy..."
echo "This may take 2-3 minutes..."
sleep 30

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "✅ NiaHubX Deployment Complete!"
echo "=========================================="
echo ""
echo "Access the application:"
echo "  Frontend:        http://localhost"
echo "  API Gateway:     http://localhost:9096"
echo "  Eureka Dashboard: http://localhost:8761"
echo ""
echo "Default Credentials:"
echo "  Super Admin: superadmin@gmail.com / admin@123"
echo ""
echo "Useful commands:"
echo "  View logs:       docker-compose logs -f"
echo "  Stop services:   docker-compose down"
echo "  Restart:         docker-compose restart"
echo ""
