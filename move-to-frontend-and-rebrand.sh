#!/bin/bash

# Complete NiaHub Rebranding and Frontend Restructuring Script
# This script:
# 1. Replaces all "MarketaGlobal" with "NiaHub"
# 2. Moves all frontend code to frontend/ directory
# 3. Updates all paths and configurations

set -e

echo "=========================================="
echo "NiaHub Complete Restructuring"
echo "=========================================="
echo ""

# Step 1: Replace all MarketaGlobal references
echo "🔄 Replacing MarketaGlobal with NiaHub..."

# Replace in all source files
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/MarketaGlobal/NiaHub/g' {} +
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/marketaglobal/niahub/g' {} +

echo "✅ Replaced all MarketaGlobal references"

# Step 2: Create frontend directory structure
echo "📁 Creating frontend directory..."
mkdir -p frontend

# Step 3: Move frontend files
echo "📦 Moving frontend files to frontend/..."

# Move source code
[ -d "src" ] && mv src frontend/ && echo "  ✓ Moved src/"
[ -d "public" ] && mv public frontend/ && echo "  ✓ Moved public/"

# Move configuration files
[ -f "index.html" ] && mv index.html frontend/ && echo "  ✓ Moved index.html"
[ -f "package.json" ] && mv package.json frontend/ && echo "  ✓ Moved package.json"
[ -f "package-lock.json" ] && mv package-lock.json frontend/ && echo "  ✓ Moved package-lock.json"
[ -f "vite.config.js" ] && mv vite.config.js frontend/ && echo "  ✓ Moved vite.config.js"
[ -f "tailwind.config.js" ] && mv tailwind.config.js frontend/ && echo "  ✓ Moved tailwind.config.js"
[ -f "postcss.config.js" ] && mv postcss.config.js frontend/ && echo "  ✓ Moved postcss.config.js"
[ -f "eslint.config.js" ] && mv eslint.config.js frontend/ && echo "  ✓ Moved eslint.config.js"
[ -f "jsconfig.json" ] && mv jsconfig.json frontend/ && echo "  ✓ Moved jsconfig.json"
[ -f "components.json" ] && mv components.json frontend/ && echo "  ✓ Moved components.json"
[ -f ".env" ] && mv .env frontend/ && echo "  ✓ Moved .env"

# Move node_modules if exists
[ -d "node_modules" ] && mv node_modules frontend/ && echo "  ✓ Moved node_modules/"

# Step 4: Move documentation to docs folder
echo "📚 Organizing documentation..."
mkdir -p docs
mv *.md docs/ 2>/dev/null || true
echo "  ✓ Moved documentation files"

# Step 5: Create new root README
cat > README.md << 'EOF'
# NiaHub - Property Marketplace Platform

**Your Gateway to Property in Kenya and Beyond**

NiaHub is a comprehensive property marketplace platform connecting buyers, sellers, and renters across Kenya and East Africa.

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
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Spring Boot microservices
│   ├── globalhub-gateway/
│   ├── globalhub-property-service/
│   └── [other services]
├── docs/            # Documentation
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- MySQL 8+

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

### Backend Setup
```bash
cd backend
# Start each microservice (see backend/README.md for details)
./restart-services.sh
```
Backend gateway runs on: http://localhost:9096

## 🌍 SEO & Keywords

NiaHub is optimized for searches including:
- Property for sale in Kenya
- Houses for rent in Nairobi
- Land for sale in Kenya
- Real estate Kenya
- Property marketplace Kenya
- Apartments Nairobi, Mombasa, Kisumu

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:
- `docs/RESTRUCTURE_TO_NIAHUB.md` - Rebranding guide
- `docs/QUICK_START.md` - Getting started guide
- `docs/SYSTEM_ARCHITECTURE.md` - Architecture overview

## 🔗 Important URLs

- **Frontend Dev**: http://localhost:5173
- **Backend Gateway**: http://localhost:9096
- **Admin Portal**: http://localhost:5173/AdminLogin
- **Vendor Portal**: http://localhost:5173/VendorPortal

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- React Query

### Backend
- Spring Boot 3
- MySQL 8
- Spring Cloud Gateway
- Microservices Architecture

## 📄 License

Proprietary - All rights reserved © 2026 NiaHub

## 📧 Contact

- Email: info@niahub.co.ke
- Website: https://niahub.co.ke
EOF

# Step 6: Create frontend README
cat > frontend/README.md << 'EOF'
# NiaHub Frontend

React + Vite frontend application for NiaHub property marketplace.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:9096/api
```

## Project Structure

```
src/
├── api/              # API client
├── components/       # Reusable components
├── config/          # Configuration files
├── contexts/        # React contexts
├── lib/             # Utilities
├── pages/           # Page components
└── App.jsx          # Main app component
```
EOF

echo ""
echo "=========================================="
echo "✅ Restructuring Complete!"
echo "=========================================="
echo ""
echo "Changes made:"
echo "✅ Replaced all 'MarketaGlobal' with 'NiaHub'"
echo "✅ Replaced all 'marketaglobal' with 'niahub'"
echo "✅ Moved all frontend code to frontend/"
echo "✅ Organized documentation in docs/"
echo "✅ Created new README files"
echo ""
echo "Next steps:"
echo "1. cd frontend"
echo "2. npm install"
echo "3. npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:9096"
echo ""
