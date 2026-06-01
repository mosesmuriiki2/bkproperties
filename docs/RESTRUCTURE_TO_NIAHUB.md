# NiaHub Restructuring Guide

## Overview
This guide explains how to restructure the project to:
1. Rebrand from GlobalHub to NiaHub
2. Move frontend to `frontend/` directory
3. Add comprehensive SEO optimization
4. Maintain backend compatibility

## Changes Made

### 1. Branding Updates
- ✅ Updated `src/contexts/BrandingContext.jsx` - Changed logo to 🏠 and name to "NiaHub"
- ✅ Created `src/config/branding.js` - Central branding configuration
- ✅ Updated `index.html` - Added comprehensive SEO meta tags
- ✅ Updated `package.json` - Changed name to "niahub-frontend"

### 2. SEO Optimization
- ✅ Created `src/components/SEO.jsx` - React Helmet component for dynamic SEO
- ✅ Added `public/robots.txt` - Search engine crawling rules
- ✅ Created `public/site.webmanifest` - PWA manifest with NiaHub branding
- ✅ Added react-helmet-async dependency
- ✅ Integrated HelmetProvider in App.jsx

### 3. SEO Keywords Targeting
The platform is now optimized for:
- **Primary**: property for sale Kenya, houses for sale Kenya, land for sale Kenya
- **Location-based**: property Nairobi, apartments Nairobi, land Kiambu
- **Property types**: buy house Kenya, rent apartment Kenya, commercial property
- **Long-tail**: affordable houses Kenya, luxury apartments Nairobi
- **Regional**: property East Africa, real estate Africa

### 4. Structured Data (Schema.org)
- Organization schema for NiaHub
- RealEstateListing schema for properties
- GeoCoordinates for location-based searches
- Proper address formatting for Kenya

## Manual Steps Required

### Step 1: Install Dependencies
```bash
npm install react-helmet-async
```

### Step 2: Move Frontend to Separate Directory (Optional)
If you want to move frontend to `frontend/` folder:

```bash
# Create frontend directory
mkdir -p frontend

# Move frontend files
mv src frontend/
mv public frontend/
mv index.html frontend/
mv package.json frontend/
mv package-lock.json frontend/
mv vite.config.js frontend/
mv tailwind.config.js frontend/
mv postcss.config.js frontend/
mv eslint.config.js frontend/
mv jsconfig.json frontend/
mv components.json frontend/
mv node_modules frontend/

# Move to frontend and reinstall
cd frontend
npm install
```

### Step 3: Update Backend CORS (if frontend moved)
If you moved frontend to a separate directory, update backend CORS configuration:

**File**: `backend/globalhub-gateway/src/main/java/com/globalhub/gateway/config/SecurityConfig.java`

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",  // Frontend dev server
    "http://localhost:3000",
    "https://niahub.co.ke"    // Production domain
));
```

### Step 4: Update Vite Config (if needed)
**File**: `frontend/vite.config.js` (or `vite.config.js` if not moved)

Ensure proxy is configured:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9096',
        changeOrigin: true
      }
    }
  }
})
```

### Step 5: Add SEO to Pages
Update key pages to use the SEO component:

**Example - Home Page**:
```jsx
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Home"
        description="Find your dream property in Kenya"
        keywords={["property Kenya", "houses for sale"]}
      />
      {/* Page content */}
    </>
  );
}
```

**Example - Property Detail Page**:
```jsx
import SEO from '@/components/SEO';

export default function PropertyDetail() {
  const property = /* load property data */;
  
  return (
    <>
      <SEO 
        title={property.title}
        description={property.description}
        keywords={[property.county, property.propertyType]}
        propertyData={property}
        type="product"
      />
      {/* Page content */}
    </>
  );
}
```

### Step 6: Create Favicon and Images
Create the following image assets in `public/`:
- `favicon.ico` - 16x16, 32x32, 48x48
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180
- `icon-192x192.png` - For PWA
- `icon-512x512.png` - For PWA
- `og-image.jpg` - 1200x630 for social sharing
- `logo.png` - NiaHub logo

### Step 7: Update Database References (Optional)
If you want to rename database from `globalhub` to `niahub`:

```sql
-- Backup first!
mysqldump -u root -p globalhub > globalhub_backup.sql

-- Create new database
CREATE DATABASE niahub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import data
mysql -u root -p niahub < globalhub_backup.sql

-- Update application.yml files in all services
```

## Testing SEO

### 1. Google Rich Results Test
Visit: https://search.google.com/test/rich-results
Test your property pages for structured data

### 2. Facebook Sharing Debugger
Visit: https://developers.facebook.com/tools/debug/
Test Open Graph tags

### 3. Twitter Card Validator
Visit: https://cards-dev.twitter.com/validator
Test Twitter card metadata

### 4. Lighthouse SEO Audit
Run in Chrome DevTools:
```bash
# Or use CLI
npm install -g lighthouse
lighthouse http://localhost:5173 --only-categories=seo
```

## Project Structure After Restructuring

```
niahub/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── SEO.jsx         # SEO component
│   │   ├── config/
│   │   │   └── branding.js     # Branding config
│   │   ├── contexts/
│   │   │   └── BrandingContext.jsx
│   │   ├── pages/
│   │   └── App.jsx
│   ├── public/
│   │   ├── robots.txt
│   │   ├── site.webmanifest
│   │   └── [images]
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                     # Spring Boot services
│   ├── globalhub-gateway/
│   ├── globalhub-property-service/
│   └── [other services]
├── docs/                        # Documentation
└── README.md
```

## SEO Best Practices Implemented

### 1. Meta Tags
- ✅ Title tags with keywords
- ✅ Meta descriptions (150-160 characters)
- ✅ Keywords meta tag
- ✅ Author and language tags
- ✅ Geo-location tags for Kenya

### 2. Open Graph
- ✅ og:title, og:description, og:image
- ✅ og:type for different page types
- ✅ og:locale set to en_KE

### 3. Twitter Cards
- ✅ Summary large image cards
- ✅ Proper image dimensions (1200x630)

### 4. Structured Data
- ✅ Organization schema
- ✅ RealEstateListing schema
- ✅ GeoCoordinates for properties
- ✅ Offer schema with KES currency

### 5. Technical SEO
- ✅ Canonical URLs
- ✅ robots.txt
- ✅ XML sitemap (to be generated)
- ✅ Mobile-responsive (already implemented)
- ✅ Fast loading (Vite optimization)

### 6. Content SEO
- ✅ Semantic HTML
- ✅ Descriptive alt tags (implement in images)
- ✅ Heading hierarchy
- ✅ Internal linking structure

## Running the Application

### Development
```bash
# Frontend (from root or frontend/)
npm run dev

# Backend
cd backend
./restart-services.sh
```

### Production Build
```bash
# Frontend
npm run build

# Serve with nginx or similar
```

## Next Steps

1. **Generate Sitemap**: Create dynamic sitemap.xml with all property URLs
2. **Add Alt Tags**: Ensure all images have descriptive alt text
3. **Content Marketing**: Create blog/guides about Kenya property market
4. **Local SEO**: Add Google My Business listing
5. **Backlinks**: Partner with Kenya real estate sites
6. **Performance**: Optimize images, lazy loading
7. **Analytics**: Add Google Analytics and Search Console

## Support

For issues or questions about the restructuring:
1. Check this documentation
2. Review the code comments in updated files
3. Test locally before deploying

## Rollback Plan

If you need to rollback:
1. Restore from git: `git checkout HEAD~1`
2. Reinstall dependencies: `npm install`
3. Restart services

## Success Metrics

Track these after deployment:
- Organic search traffic from Kenya
- Property page impressions in Google Search Console
- Click-through rate from search results
- Time on site and bounce rate
- Conversion rate (inquiries/bookings)
