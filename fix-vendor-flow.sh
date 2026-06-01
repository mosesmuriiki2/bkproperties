#!/bin/bash

echo "========================================="
echo "Fixing Vendor Flow Issues"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Create upload directories${NC}"
mkdir -p uploads/vendor-documents uploads/property-images
chmod -R 755 uploads
echo -e "${GREEN}✓ Upload directories created${NC}"
echo ""

echo -e "${YELLOW}Step 2: Check database tables${NC}"
mysql -u root -proot -e "USE globalhub; SHOW TABLES LIKE '%vendor%';" 2>/dev/null
mysql -u root -proot -e "USE globalhub; SHOW TABLES LIKE '%propert%';" 2>/dev/null
echo ""

echo -e "${YELLOW}Step 3: Check existing data${NC}"
echo "Users with VENDOR role:"
mysql -u root -proot -e "USE globalhub; SELECT id, email, first_name, last_name, role FROM users WHERE role = 'VENDOR';" 2>/dev/null
echo ""

echo "Vendors:"
mysql -u root -proot -e "USE globalhub; SELECT id, user_id, business_name, email, status FROM vendors;" 2>/dev/null
echo ""

echo "Properties:"
mysql -u root -proot -e "USE globalhub; SELECT id, vendor_id, title, status FROM properties;" 2>/dev/null
echo ""

echo -e "${YELLOW}Step 4: Test API endpoints${NC}"
echo "Testing vendor endpoint..."
curl -s http://localhost:8084/api/vendors | jq '.' || echo "Vendor service not responding"
echo ""

echo "Testing property endpoint..."
curl -s http://localhost:8083/api/properties/pending?page=0&size=10 | jq '.' || echo "Property service not responding"
echo ""

echo "========================================="
echo -e "${GREEN}Fix Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Restart backend services if needed"
echo "2. Clear browser cache and localStorage"
echo "3. Try creating a new vendor/property"
echo "4. Check browser console for errors"
echo ""
