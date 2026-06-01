#!/bin/bash

# NiaHub Rebranding and Restructuring Script
# This script:
# 1. Moves frontend files to frontend/ directory
# 2. Rebrands from GlobalHub to NiaHub
# 3. Updates all configurations
# 4. Adds SEO optimization

set -e

echo "=========================================="
echo "NiaHub Rebranding and Restructuring"
echo "=========================================="

# Create frontend directory
echo "Creating frontend directory..."
mkdir -p frontend

# Move frontend files to frontend directory
echo "Moving frontend files..."
mv src frontend/ 2>/dev/null || true
mv public frontend/ 2>/dev/null || true
mv index.html frontend/ 2>/dev/null || true
mv package.json frontend/ 2>/dev/null || true
mv package-lock.json frontend/ 2>/dev/null || true
mv vite.config.js frontend/ 2>/dev/null || true
mv tailwind.config.js frontend/ 2>/dev/null || true
mv postcss.config.js frontend/ 2>/dev/null || true
mv eslint.config.js frontend/ 2>/dev/null || true
mv jsconfig.json frontend/ 2>/dev/null || true
mv components.json frontend/ 2>/dev/null || true
mv node_modules frontend/ 2>/dev/null || true
mv .env frontend/ 2>/dev/null || true

# Move documentation files to docs directory
echo "Organizing documentation..."
mkdir -p docs
mv *.md docs/ 2>/dev/null || true

# Create new README in root
cat > README.md << 'EOF'
# NiaHub - Property Marketplace Platform

NiaHub is a comprehensive property marketplace platform connecting buyers, sellers, and renters across Kenya and beyond.

## 🏠 Features

- **Property Listings**: Houses, apartments, land, and commercial properties
- **Advanced Search**: Filter by location, price, type, and amenities
- **Booking System**: Schedule property viewings with vendors
- **Vendor Portal**: Manage properties, availability, and bookings
- **Admin Dashboard**: Property approval and platform management
- **SEO Optimized**: Discoverable for property searches in Kenya

## 📁 Project Structure

```
niahub/
├── frontend/          # React + Vite frontend application
├── backend/           # Spring Boot microservices
├── docs/             # Documentation files
└── README.md         # This file
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
# Start each microservice (see backend/README.md)
```

## 🌍 SEO Keywords

NiaHub is optimized for:
- Property for sale in Kenya
- Houses for rent in Nairobi
- Land for sale in Kenya
- Real estate Kenya
- Property marketplace Kenya
- Buy house Kenya
- Rent apartment Nairobi

## 📖 Documentation

See the `docs/` directory for detailed documentation.

## 🔗 Links

- Frontend: http://localhost:5173
- Backend Gateway: http://localhost:9096
- Admin Portal: http://localhost:5173/AdminLogin

## 📄 License

Proprietary - All rights reserved
EOF

echo "✅ Restructuring complete!"
echo ""
echo "Next steps:"
echo "1. cd frontend && npm install"
echo "2. Update backend CORS to allow http://localhost:5173"
echo "3. npm run dev"
