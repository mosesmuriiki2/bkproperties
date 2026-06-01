#!/bin/bash

# BK Properties - Complete Setup Master Script
# This script does everything in one go

set -e

echo "=========================================="
echo "🏘️  BK Properties - Complete Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Remove git
echo -e "${BLUE}Step 1: Removing git history...${NC}"
if [ -d ".git" ]; then
    rm -rf .git
    echo -e "${GREEN}✓ Git history removed${NC}"
fi

# Step 2: Update branding in current location
echo -e "${BLUE}Step 2: Updating branding to BK Properties...${NC}"

# Update frontend branding
find frontend/src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/NiaHubX/BK Properties/g' {} +
find frontend/src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/niahubx/bkproperties/g' {} +

# Update package.json
sed -i 's/"name": ".*"/"name": "bkproperties-frontend"/' frontend/package.json

# Update index.html title
sed -i 's/<title>.*<\/title>/<title>BK Properties - Buy, Sell \& Rent Property in Kenya<\/title>/' frontend/index.html

echo -e "${GREEN}✓ Branding updated${NC}"

# Step 3: Create branding config
echo -e "${BLUE}Step 3: Creating BK Properties configuration...${NC}"

cat > frontend/src/config/branding.js << 'EOFBRANDING'
export const BRANDING = {
  name: "BK Properties",
  tagline: "Your Trusted Property Partner in Kenya & Africa",
  logo: "🏘️",
  contact: {
    email: "info@bkproperties.co.ke",
    phone: "+254 720 321107",
    whatsapp: "+254720321107",
    address: "Nairobi, Kenya"
  },
  social: {
    facebook: "https://facebook.com/bkproperties",
    twitter: "https://twitter.com/bkproperties",
    instagram: "https://instagram.com/bkproperties",
    linkedin: "https://linkedin.com/company/bkproperties",
    youtube: "https://youtube.com/@bkproperties"
  },
  colors: {
    primary: "#16a34a",
    secondary: "#000000",
    accent: "#22c55e",
    dark: "#0a0a0a",
    light: "#ffffff",
    gray: "#6b7280"
  }
};
export default BRANDING;
EOFBRANDING

echo -e "${GREEN}✓ Configuration created${NC}"

# Step 4: Update BrandingContext
echo -e "${BLUE}Step 4: Updating BrandingContext...${NC}"

cat > frontend/src/contexts/BrandingContext.jsx << 'EOFCONTEXT'
import React, { createContext, useContext, useState, useEffect } from "react";
import { getBrandingConfig, updateBrandingConfig } from "../services/dataService";

const BrandingContext = createContext();

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    logo: "🏘️",
    logoText: "BK Properties",
    primaryColor: "#16a34a",
    secondaryColor: "#000000",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const config = await getBrandingConfig();
        setBranding(config);
      } catch (error) {
        console.error("Failed to load branding config:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBranding();
  }, []);

  const updateBranding = async (newConfig) => {
    try {
      const updated = { ...branding, ...newConfig };
      const result = await updateBrandingConfig(updated);
      if (result.success) {
        setBranding(updated);
        localStorage.setItem("bk_branding", JSON.stringify(updated));
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error("Failed to update branding:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
};
EOFCONTEXT

echo -e "${GREEN}✓ BrandingContext updated${NC}"

# Step 5: Update README
echo -e "${BLUE}Step 5: Creating README...${NC}"

cat > README.md << 'EOFREADME'
# BK Properties

**Your Trusted Property Partner in Kenya & Africa**

## 🏘️ About

BK Properties is a comprehensive property marketplace specializing in:
- Houses for sale and rent
- Land for sale
- Apartments
- Commercial properties
- Lease properties

## 📞 Contact

- **Phone**: +254 720 321107
- **Email**: info@bkproperties.co.ke
- **WhatsApp**: +254 720 321107

## 🚀 Quick Start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && ./restart-services.sh

# Docker
bash docker-quick-start.sh
```

## 📄 License

© 2026 BK Properties - All rights reserved
EOFREADME

echo -e "${GREEN}✓ README created${NC}"

# Step 6: Clean up unnecessary files
echo -e "${BLUE}Step 6: Cleaning up...${NC}"

# Remove non-property backend services if they exist
rm -rf backend/globalhub-hotel-service 2>/dev/null || true
rm -rf backend/globalhub-tour-service 2>/dev/null || true
rm -rf backend/globalhub-product-service 2>/dev/null || true
rm -rf backend/globalhub-payment-service 2>/dev/null || true

echo -e "${GREEN}✓ Cleanup complete${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ BK Properties Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the changes"
echo "2. Copy new home page: cp frontend-new-home-page.jsx frontend/src/pages/Home.jsx"
echo "3. Test: cd frontend && npm install && npm run dev"
echo "4. Initialize git: git init"
echo "5. Add remote: git remote add origin <your-repo-url>"
echo "6. Commit: git add . && git commit -m 'Initial BK Properties setup'"
echo "7. Push: git push -u origin main"
echo ""
echo -e "${BLUE}Contact: +254 720 321107 | info@bkproperties.co.ke${NC}"
echo ""
