#!/bin/bash

# BK Properties Setup Script
# Creates a property-focused replica with new branding

set -e

echo "=========================================="
echo "BK Properties - Setup Script"
echo "=========================================="
echo ""

# Step 1: Remove git history
echo "🗑️  Step 1: Removing git history..."
if [ -d ".git" ]; then
    rm -rf .git
    echo "✓ Git history removed"
else
    echo "✓ No git history found"
fi

# Step 2: Create new project structure
echo "📁 Step 2: Creating BK Properties structure..."
mkdir -p bkproperties
cd bkproperties

# Copy only necessary backend services
echo "📦 Copying backend services..."
mkdir -p backend
cp -r ../backend/globalhub-eureka backend/
cp -r ../backend/globalhub-gateway backend/
cp -r ../backend/globalhub-auth-service backend/
cp -r ../backend/globalhub-property-service backend/
cp -r ../backend/globalhub-vendor-service backend/
cp -r ../backend/database-schema.sql backend/
cp -r ../backend/create-super-admin.sql backend/
cp -r ../backend/add-sample-properties.sql backend/

# Copy frontend
echo "🎨 Copying frontend..."
cp -r ../frontend .

# Copy Docker files
echo "🐳 Copying Docker configuration..."
cp ../docker-compose.yml .
cp ../build-all-services.sh .
cp ../docker-quick-start.sh .

echo ""
echo "=========================================="
echo "✅ BK Properties structure created!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. cd bkproperties"
echo "2. Run: bash rebrand-to-bkproperties.sh"
echo "3. Initialize new git repo: git init"
echo ""
