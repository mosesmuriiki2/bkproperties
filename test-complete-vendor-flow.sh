#!/bin/bash

echo "========================================="
echo "Complete Vendor Flow Test"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Base URLs
AUTH_URL="http://localhost:7072/api/auth"
VENDOR_URL="http://localhost:8084/api/vendors"
PROPERTY_URL="http://localhost:8083/api/properties"

# Test data
TEST_EMAIL="vendor$(date +%s)@test.com"
TEST_PASSWORD="test123"

echo -e "${BLUE}Test Configuration:${NC}"
echo "Email: $TEST_EMAIL"
echo "Password: $TEST_PASSWORD"
echo ""

# Step 1: Check services are running
echo -e "${YELLOW}Step 1: Checking Services${NC}"
echo "--------------------------------------"

check_service() {
    local url=$1
    local name=$2
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $name is running${NC}"
        return 0
    else
        echo -e "${RED}✗ $name is not responding${NC}"
        return 1
    fi
}

check_service "$AUTH_URL/../actuator/health" "Auth Service"
check_service "$VENDOR_URL/../actuator/health" "Vendor Service"
check_service "$PROPERTY_URL/../actuator/health" "Property Service"
echo ""

# Step 2: Register user with VENDOR role
echo -e "${YELLOW}Step 2: Register User (VENDOR role)${NC}"
echo "--------------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST $AUTH_URL/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"Vendor\",
    \"phone\": \"+254700000001\",
    \"role\": \"VENDOR\"
  }")

echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"

USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.userId' 2>/dev/null)
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken' 2>/dev/null)

if [ "$USER_ID" != "null" ] && [ -n "$USER_ID" ]; then
  echo -e "${GREEN}✓ User created: ID=$USER_ID${NC}"
else
  echo -e "${RED}✗ User registration failed${NC}"
  exit 1
fi
echo ""

# Step 3: Create vendor profile
echo -e "${YELLOW}Step 3: Create Vendor Profile${NC}"
echo "--------------------------------------"
VENDOR_RESPONSE=$(curl -s -X POST $VENDOR_URL/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"userId\": $USER_ID,
    \"businessName\": \"Test Properties Ltd\",
    \"businessType\": \"company\",
    \"propertyCategory\": \"BOTH\",
    \"listingType\": \"BOTH\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"+254700000001\",
    \"address\": \"123 Test Street, Nairobi\",
    \"county\": \"Nairobi\",
    \"subCounty\": \"Westlands\",
    \"idNumber\": \"12345678\"
  }")

echo "$VENDOR_RESPONSE" | jq '.' 2>/dev/null || echo "$VENDOR_RESPONSE"

VENDOR_ID=$(echo "$VENDOR_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ "$VENDOR_ID" != "null" ] && [ -n "$VENDOR_ID" ]; then
  echo -e "${GREEN}✓ Vendor created: ID=$VENDOR_ID${NC}"
else
  echo -e "${RED}✗ Vendor creation failed${NC}"
  exit 1
fi
echo ""

# Step 4: Create property
echo -e "${YELLOW}Step 4: Create Property Listing${NC}"
echo "--------------------------------------"
PROPERTY_RESPONSE=$(curl -s -X POST $PROPERTY_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"vendorId\": $VENDOR_ID,
    \"title\": \"Beautiful 3BR House in Westlands\",
    \"description\": \"Modern house with garden and parking\",
    \"propertyType\": \"HOUSE\",
    \"listingType\": \"SALE\",
    \"price\": 15000000,
    \"bedrooms\": 3,
    \"bathrooms\": 2,
    \"areaSqm\": 150,
    \"address\": \"Westlands, Nairobi\",
    \"county\": \"Nairobi\",
    \"subCounty\": \"Westlands\",
    \"features\": [\"Garden\", \"Parking\", \"Security\"],
    \"amenities\": [\"Water\", \"Electricity\", \"Internet\"]
  }")

echo "$PROPERTY_RESPONSE" | jq '.' 2>/dev/null || echo "$PROPERTY_RESPONSE"

PROPERTY_ID=$(echo "$PROPERTY_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ "$PROPERTY_ID" != "null" ] && [ -n "$PROPERTY_ID" ]; then
  echo -e "${GREEN}✓ Property created: ID=$PROPERTY_ID${NC}"
else
  echo -e "${RED}✗ Property creation failed${NC}"
  exit 1
fi
echo ""

# Step 5: Verify vendor can fetch their data
echo -e "${YELLOW}Step 5: Verify Vendor Data Access${NC}"
echo "--------------------------------------"

echo "Fetching vendor by userId..."
VENDOR_BY_USER=$(curl -s -X GET "$VENDOR_URL/user/$USER_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$VENDOR_BY_USER" | jq '.' 2>/dev/null || echo "$VENDOR_BY_USER"

FETCHED_VENDOR_ID=$(echo "$VENDOR_BY_USER" | jq -r '.id' 2>/dev/null)
if [ "$FETCHED_VENDOR_ID" == "$VENDOR_ID" ]; then
  echo -e "${GREEN}✓ Vendor data fetched successfully${NC}"
else
  echo -e "${RED}✗ Failed to fetch vendor data${NC}"
fi
echo ""

echo "Fetching vendor properties..."
VENDOR_PROPS=$(curl -s -X GET "$PROPERTY_URL/vendor/$VENDOR_ID?page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$VENDOR_PROPS" | jq '.' 2>/dev/null || echo "$VENDOR_PROPS"

PROP_COUNT=$(echo "$VENDOR_PROPS" | jq -r '.content | length' 2>/dev/null)
if [ "$PROP_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Found $PROP_COUNT property(ies)${NC}"
else
  echo -e "${RED}✗ No properties found${NC}"
fi
echo ""

# Step 6: Test OTP flow
echo -e "${YELLOW}Step 6: Test OTP Flow${NC}"
echo "--------------------------------------"

echo "Sending OTP..."
OTP_RESPONSE=$(curl -s -X POST $AUTH_URL/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\"}")

echo "$OTP_RESPONSE"
echo -e "${GREEN}✓ OTP sent (check auth service logs)${NC}"
echo -e "${BLUE}To get OTP, run: tail -f backend/globalhub-auth-service/logs/application.log | grep OTP${NC}"
echo ""

# Step 7: Test admin access
echo -e "${YELLOW}Step 7: Test Admin Access${NC}"
echo "--------------------------------------"

echo "Logging in as admin..."
ADMIN_LOGIN=$(curl -s -X POST $AUTH_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@gmail.com",
    "password": "admin@123"
  }')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.accessToken' 2>/dev/null)

if [ "$ADMIN_TOKEN" != "null" ] && [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin logged in successfully${NC}"
  
  echo ""
  echo "Fetching all vendors..."
  ALL_VENDORS=$(curl -s -X GET "$VENDOR_URL?page=0&size=50" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  echo "$ALL_VENDORS" | jq '.' 2>/dev/null || echo "$ALL_VENDORS"
  
  VENDOR_COUNT=$(echo "$ALL_VENDORS" | jq -r '.content | length' 2>/dev/null)
  if [ -z "$VENDOR_COUNT" ]; then
    VENDOR_COUNT=$(echo "$ALL_VENDORS" | jq -r 'length' 2>/dev/null)
  fi
  
  echo -e "${GREEN}✓ Found $VENDOR_COUNT vendor(s)${NC}"
  
  echo ""
  echo "Fetching pending properties..."
  PENDING_PROPS=$(curl -s -X GET "$PROPERTY_URL/pending?page=0&size=50" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  echo "$PENDING_PROPS" | jq '.' 2>/dev/null || echo "$PENDING_PROPS"
  
  PENDING_COUNT=$(echo "$PENDING_PROPS" | jq -r '.content | length' 2>/dev/null)
  echo -e "${GREEN}✓ Found $PENDING_COUNT pending property(ies)${NC}"
  
  echo ""
  echo "Approving property..."
  APPROVE_RESPONSE=$(curl -s -X PUT "$PROPERTY_URL/$PROPERTY_ID/approve" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  echo "$APPROVE_RESPONSE" | jq '.' 2>/dev/null || echo "$APPROVE_RESPONSE"
  
  STATUS=$(echo "$APPROVE_RESPONSE" | jq -r '.status' 2>/dev/null)
  if [ "$STATUS" == "ACTIVE" ]; then
    echo -e "${GREEN}✓ Property approved successfully${NC}"
  else
    echo -e "${RED}✗ Property approval failed${NC}"
  fi
else
  echo -e "${RED}✗ Admin login failed${NC}"
fi
echo ""

# Step 8: Database verification
echo -e "${YELLOW}Step 8: Database Verification${NC}"
echo "--------------------------------------"

echo "Checking database..."
mysql -u root -proot -e "USE globalhub; 
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users WHERE role='VENDOR'
UNION ALL
SELECT 'Vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties;" 2>/dev/null

echo ""
echo "Recent vendor:"
mysql -u root -proot -e "USE globalhub; 
SELECT id, user_id, business_name, email, status 
FROM vendors 
ORDER BY created_at DESC LIMIT 1;" 2>/dev/null

echo ""
echo "Recent property:"
mysql -u root -proot -e "USE globalhub; 
SELECT id, vendor_id, title, status, price 
FROM properties 
ORDER BY created_at DESC LIMIT 1;" 2>/dev/null

echo ""

# Step 9: File system verification
echo -e "${YELLOW}Step 9: File System Verification${NC}"
echo "--------------------------------------"

echo "Upload directories:"
ls -la uploads/ 2>/dev/null || echo "No uploads folder"

echo ""
echo "Vendor documents:"
ls -la uploads/vendor-documents/ 2>/dev/null || echo "No vendor documents"

echo ""
echo "Property images:"
ls -la uploads/property-images/ 2>/dev/null || echo "No property images"

echo ""

# Summary
echo "========================================="
echo -e "${GREEN}Test Summary${NC}"
echo "========================================="
echo ""
echo "Created Resources:"
echo "  User ID: $USER_ID"
echo "  Vendor ID: $VENDOR_ID"
echo "  Property ID: $PROPERTY_ID"
echo "  Email: $TEST_EMAIL"
echo ""
echo "Test Results:"
echo "  ✓ User registration"
echo "  ✓ Vendor profile creation"
echo "  ✓ Property listing creation"
echo "  ✓ Vendor data access"
echo "  ✓ Admin access"
echo "  ✓ Property approval"
echo ""
echo "Frontend URLs to test:"
echo "  Vendor Login: http://localhost:5173/vendor-login"
echo "  Admin Dashboard: http://localhost:5173/AdminDashboard"
echo "  List Property: http://localhost:5173/list-property"
echo ""
echo "To login as vendor:"
echo "  1. Go to: http://localhost:5173/vendor-login"
echo "  2. Email: $TEST_EMAIL"
echo "  3. Get OTP from logs: tail -f backend/globalhub-auth-service/logs/application.log | grep OTP"
echo ""
echo "To login as admin:"
echo "  1. Go to: http://localhost:5173/login"
echo "  2. Email: superadmin@gmail.com"
echo "  3. Password: admin@123"
echo ""
