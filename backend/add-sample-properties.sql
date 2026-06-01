-- Add Sample Approved Properties to Database
-- Run this after you have at least one vendor in the system

-- First, let's add some sample properties with ACTIVE status
-- Replace vendor_id with actual vendor IDs from your database

INSERT INTO properties (
    vendor_id, title, description, property_type, listing_type, 
    price, currency, bedrooms, bathrooms, area_sqm, 
    address, county, sub_county, 
    images, status, views_count, created_at, updated_at
) VALUES 
(
    1, -- Replace with actual vendor_id
    '4 Bedroom Villa in Karen',
    'Luxurious 4-bedroom villa with modern amenities, spacious garden, and stunning views. Perfect for families looking for comfort and elegance in one of Nairobi''s most prestigious neighborhoods.',
    'HOUSE',
    'SALE',
    45000000.00,
    'KSH',
    4,
    3,
    350.00,
    'Karen Road, Karen',
    'Nairobi',
    'Karen',
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"]',
    'ACTIVE',
    245,
    NOW(),
    NOW()
),
(
    1, -- Replace with actual vendor_id
    '1/2 Acre Plot in Kitisuru',
    'Prime 1/2 acre plot in the exclusive Kitisuru area. Ready title deed, all utilities available. Ideal for building your dream home in a secure and serene environment.',
    'LAND',
    'SALE',
    28000000.00,
    'KSH',
    NULL,
    NULL,
    NULL,
    'Kitisuru Road',
    'Nairobi',
    'Westlands',
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"]',
    'ACTIVE',
    189,
    NOW(),
    NOW()
),
(
    1, -- Replace with actual vendor_id
    '3 Bedroom Apartment - Kilimani',
    'Modern 3-bedroom apartment in the heart of Kilimani. Features include fitted kitchen, ample parking, 24/7 security, and backup generator. Close to shopping malls and major roads.',
    'APARTMENT',
    'RENT',
    85000.00,
    'KSH',
    3,
    2,
    120.00,
    'Argwings Kodhek Road, Kilimani',
    'Nairobi',
    'Kilimani',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"]',
    'ACTIVE',
    156,
    NOW(),
    NOW()
),
(
    1, -- Replace with actual vendor_id
    '5 Bedroom House in Runda',
    'Spectacular 5-bedroom house in Runda Estate. Features include swimming pool, DSQ, landscaped garden, and state-of-the-art security. Perfect for executives and diplomats.',
    'HOUSE',
    'SALE',
    75000000.00,
    'KSH',
    5,
    4,
    450.00,
    'Runda Estate',
    'Nairobi',
    'Westlands',
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"]',
    'ACTIVE',
    312,
    NOW(),
    NOW()
),
(
    1, -- Replace with actual vendor_id
    'Commercial Plot - Thika Road',
    '1 acre commercial plot along Thika Superhighway. High visibility location, perfect for showroom, petrol station, or commercial development. Clean title deed.',
    'LAND',
    'SALE',
    35000000.00,
    'KSH',
    NULL,
    NULL,
    NULL,
    'Thika Road, Ruiru',
    'Kiambu',
    'Ruiru',
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"]',
    'ACTIVE',
    98,
    NOW(),
    NOW()
),
(
    1, -- Replace with actual vendor_id
    '2 Bedroom Apartment - Westlands',
    'Cozy 2-bedroom apartment in Westlands. Fully furnished, modern finishes, gym, and swimming pool. Ideal for young professionals. Available immediately.',
    'APARTMENT',
    'RENT',
    65000.00,
    'KSH',
    2,
    2,
    85.00,
    'Parklands Road, Westlands',
    'Nairobi',
    'Westlands',
    '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"]',
    'ACTIVE',
    203,
    NOW(),
    NOW()
);

-- Update the images column to use proper JSON format if needed
-- Note: The images column should store JSON array of image URLs
-- If you have actual uploaded images, replace the URLs above with your image paths like:
-- '["uploads/property-images/uuid1.jpg", "/uploads/property-images/uuid2.jpg"]'

-- Verify the properties were added
SELECT id, title, property_type, listing_type, price, status, county 
FROM properties 
WHERE status = 'ACTIVE' 
ORDER BY created_at DESC;
