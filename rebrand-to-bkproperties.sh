#!/bin/bash

# BK Properties Complete Rebranding Script
# Transforms NiaHubX to BK Properties with new design and colors

set -e

echo "=========================================="
echo "BK Properties - Complete Rebranding"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Update branding configuration
echo -e "${BLUE}Step 1: Creating BK Properties branding config...${NC}"

cat > frontend/src/config/branding.js << 'EOF'
/**
 * BK Properties Branding Configuration
 * Property marketplace focused on Kenya and Africa
 */

export const BRANDING = {
  // Brand Identity
  name: "BK Properties",
  tagline: "Your Trusted Property Partner in Kenya & Africa",
  logo: "🏘️",
  
  // Contact Information
  contact: {
    email: "info@bkproperties.co.ke",
    phone: "+254 720 321107",
    whatsapp: "+254720321107",
    address: "Nairobi, Kenya"
  },
  
  // Social Media
  social: {
    facebook: "https://facebook.com/bkproperties",
    twitter: "https://twitter.com/bkproperties",
    instagram: "https://instagram.com/bkproperties",
    linkedin: "https://linkedin.com/company/bkproperties",
    youtube: "https://youtube.com/@bkproperties"
  },
  
  // Theme Colors - Black, White, Green
  colors: {
    primary: "#16a34a",      // green-600
    secondary: "#000000",    // black
    accent: "#22c55e",       // green-500
    dark: "#0a0a0a",        // near black
    light: "#ffffff",       // white
    gray: "#6b7280"         // gray-500
  },
  
  // SEO Configuration
  seo: {
    title: "BK Properties - Buy, Sell & Rent Property in Kenya | Houses, Land & Apartments",
    description: "Find your dream property in Kenya with BK Properties. Browse houses for sale, land, apartments for rent in Nairobi, Mombasa, Kisumu. Trusted property marketplace across Kenya and Africa.",
    keywords: [
      // Primary Keywords
      "property for sale Kenya",
      "houses for sale Kenya",
      "land for sale Kenya",
      "apartments for rent Kenya",
      "real estate Kenya",
      "BK Properties",
      
      // Location-based
      "property Nairobi",
      "houses Nairobi",
      "apartments Nairobi",
      "land Kiambu",
      "property Mombasa",
      "houses Kisumu",
      "property Nakuru",
      "land Machakos",
      
      // Property Types
      "buy house Kenya",
      "rent apartment Kenya",
      "commercial property Kenya",
      "residential property Kenya",
      "land plots Kenya",
      "rental properties Kenya",
      "property for lease Kenya",
      
      // Long-tail
      "affordable houses Kenya",
      "luxury apartments Nairobi",
      "property marketplace Kenya",
      "real estate listings Kenya",
      "property viewing Kenya",
      "property agents Kenya",
      
      // Regional
      "property East Africa",
      "real estate Africa",
      "Kenya property market",
      "African property investment"
    ],
    author: "BK Properties",
    ogImage: "/og-image-bk.jpg",
    twitterHandle: "@bkproperties"
  }
};

export default BRANDING;
EOF

echo -e "${GREEN}✓ Branding config created${NC}"

# Step 2: Update BrandingContext
echo -e "${BLUE}Step 2: Updating BrandingContext...${NC}"

cat > frontend/src/contexts/BrandingContext.jsx << 'EOF'
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
        // Use default if fetch fails
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
EOF

echo -e "${GREEN}✓ BrandingContext updated${NC}"

# Step 3: Update index.html
echo -e "${BLUE}Step 3: Updating index.html with BK Properties SEO...${NC}"

cat > frontend/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>BK Properties - Buy, Sell & Rent Property in Kenya | Houses, Land & Apartments</title>
    <meta name="title" content="BK Properties - Buy, Sell & Rent Property in Kenya" />
    <meta name="description" content="Find your dream property in Kenya with BK Properties. Browse houses for sale, land, apartments for rent in Nairobi, Mombasa, Kisumu. Trusted property marketplace across Kenya and Africa." />
    <meta name="keywords" content="property for sale Kenya, houses for sale Kenya, land for sale Kenya, apartments for rent Kenya, real estate Kenya, BK Properties, property Nairobi, buy house Kenya, rent apartment Kenya" />
    <meta name="author" content="BK Properties" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    <meta name="geo.region" content="KE" />
    <meta name="geo.placename" content="Kenya" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bkproperties.co.ke/" />
    <meta property="og:title" content="BK Properties - Property Marketplace in Kenya" />
    <meta property="og:description" content="Find your dream property in Kenya. Browse houses, land, and apartments across Nairobi, Mombasa, and beyond." />
    <meta property="og:image" content="/og-image-bk.jpg" />
    <meta property="og:site_name" content="BK Properties" />
    <meta property="og:locale" content="en_KE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://bkproperties.co.ke/" />
    <meta name="twitter:title" content="BK Properties - Property Marketplace in Kenya" />
    <meta name="twitter:description" content="Find your dream property in Kenya. Browse houses, land, and apartments." />
    <meta name="twitter:image" content="/og-image-bk.jpg" />
    
    <!-- Theme Color - BK Properties Green -->
    <meta name="theme-color" content="#16a34a" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://bkproperties.co.ke/" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

echo -e "${GREEN}✓ index.html updated${NC}"

# Step 4: Update package.json
echo -e "${BLUE}Step 4: Updating package.json...${NC}"

sed -i 's/"name": ".*"/"name": "bkproperties-frontend"/' frontend/package.json
sed -i 's/"description": ".*"/"description": "BK Properties - Property Marketplace Platform for Kenya and Africa"/' frontend/package.json

echo -e "${GREEN}✓ package.json updated${NC}"

# Step 5: Update tailwind config with new colors
echo -e "${BLUE}Step 5: Updating Tailwind colors...${NC}"

cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#16a34a",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#22c55e",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF

echo -e "${GREEN}✓ Tailwind config updated${NC}"

# Step 6: Update README
echo -e "${BLUE}Step 6: Creating README...${NC}"

cat > README.md << 'EOF'
# BK Properties

**Your Trusted Property Partner in Kenya & Africa**

BK Properties is a comprehensive property marketplace platform specializing in buying, selling, renting, and leasing properties across Kenya and Africa.

## 🏘️ About BK Properties

We focus exclusively on properties:
- **Houses** - For sale and rent
- **Land** - Plots and acreage
- **Apartments** - Urban living spaces
- **Commercial Properties** - Business premises
- **Rental Properties** - Short and long-term
- **Lease Properties** - Flexible options

## 🌍 Coverage

- **Kenya**: Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and all counties
- **East Africa**: Expanding across the region
- **Africa**: Pan-African property solutions

## 📞 Contact Us

- **Phone**: +254 720 321107
- **Email**: info@bkproperties.co.ke
- **WhatsApp**: +254 720 321107
- **Website**: https://bkproperties.co.ke

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
./restart-services.sh
```

### Docker Deployment
```bash
bash docker-quick-start.sh
```

## 🎨 Brand Colors

- **Primary Green**: #16a34a
- **Secondary Black**: #000000
- **Accent Green**: #22c55e
- **White**: #ffffff

## 📄 License

Proprietary - All rights reserved © 2026 BK Properties
EOF

echo -e "${GREEN}✓ README created${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ BK Properties Rebranding Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes"
echo "2. Test the application: cd frontend && npm run dev"
echo "3. Initialize git: git init"
echo "4. Add remote: git remote add origin <your-repo-url>"
echo "5. Commit and push: git add . && git commit -m 'Initial BK Properties setup' && git push -u origin main"
echo ""
