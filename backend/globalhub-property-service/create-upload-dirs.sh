#!/bin/bash

# Create upload directories for property service
echo "Creating upload directories..."

# Create main uploads directory
mkdir -p uploads/properties
mkdir -p uploads/vendors

echo "✅ Upload directories created successfully!"
echo "   - uploads/properties/ (for property images)"
echo "   - uploads/vendors/ (for vendor documents)"
echo ""
echo "These directories will be used by the Property Service to store uploaded files."
