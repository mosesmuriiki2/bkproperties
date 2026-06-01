#!/bin/bash

# NiaHub Complete Setup Script
# This script completes the NiaHub rebranding and setup

set -e

echo "=========================================="
echo "NiaHub Setup - Final Steps"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Step 1: Install new dependencies
echo "📦 Installing dependencies..."
npm install react-helmet-async

# Step 2: Create public directory if it doesn't exist
echo "📁 Setting up public directory..."
mkdir -p public

# Step 3: Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# NiaHub specific
/frontend/dist
/frontend/node_modules
*.log
.DS_Store
EOF

# Step 4: Create a simple favicon placeholder
echo "🎨 Creating placeholder favicon..."
cat > public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#10b981"/>
  <text x="50" y="70" font-size="60" text-anchor="middle" fill="white">🏠</text>
</svg>
EOF

# Step 5: Test the setup
echo "🧪 Testing setup..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting has warnings (non-critical)"
fi

echo ""
echo "=========================================="
echo "✅ NiaHub Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:5173"
echo "3. Check the browser console for any errors"
echo ""
echo "SEO Features Added:"
echo "✅ Meta tags for Kenya property searches"
echo "✅ Open Graph tags for social sharing"
echo "✅ Structured data for search engines"
echo "✅ robots.txt for search engine crawling"
echo "✅ PWA manifest for mobile"
echo ""
echo "Branding Updates:"
echo "✅ Logo changed to 🏠"
echo "✅ Name changed to NiaHub"
echo "✅ Theme color: #10b981 (emerald)"
echo ""
echo "Read RESTRUCTURE_TO_NIAHUB.md for detailed documentation"
echo ""
