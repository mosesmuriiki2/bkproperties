import { Helmet } from 'react-helmet-async';
import { BRANDING } from '@/config/branding';

/**
 * SEO Component for managing page metadata
 * Optimized for property searches in Kenya
 */
export default function SEO({ 
  title, 
  description, 
  keywords = [], 
  image,
  url,
  type = "website",
  propertyData = null 
}) {
  const siteTitle = title ? `${title} | ${BRANDING.name}` : BRANDING.seo.title;
  const siteDescription = description || BRANDING.seo.description;
  const siteKeywords = [...BRANDING.seo.keywords, ...keywords].join(', ');
  const siteImage = image || BRANDING.seo.ogImage;
  const siteUrl = url || window.location.href;

  // Generate structured data for property listings
  const generatePropertySchema = () => {
    if (!propertyData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": propertyData.title,
      "description": propertyData.description,
      "url": siteUrl,
      "image": propertyData.images || [],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": propertyData.county,
        "addressRegion": propertyData.subCounty,
        "addressCountry": "KE"
      },
      "geo": propertyData.latitude && propertyData.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": propertyData.latitude,
        "longitude": propertyData.longitude
      } : undefined,
      "offers": {
        "@type": "Offer",
        "price": propertyData.price,
        "priceCurrency": "KES",
        "availability": "https://schema.org/InStock"
      },
      "numberOfRooms": propertyData.bedrooms,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": propertyData.areaSqm,
        "unitCode": "MTK"
      }
    };
  };

  // Generate organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BRANDING.name,
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": BRANDING.seo.description,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Nairobi"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": BRANDING.contact.phone,
      "contactType": "customer service",
      "email": BRANDING.contact.email,
      "areaServed": "KE",
      "availableLanguage": ["en", "sw"]
    },
    "sameAs": Object.values(BRANDING.social)
  };

  const propertySchema = generatePropertySchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={BRANDING.seo.author} />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:site_name" content={BRANDING.name} />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      <meta name="twitter:site" content={BRANDING.seo.twitterHandle} />
      <meta name="twitter:creator" content={BRANDING.seo.twitterHandle} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Kenya" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {propertySchema && (
        <script type="application/ld+json">
          {JSON.stringify(propertySchema)}
        </script>
      )}
    </Helmet>
  );
}
