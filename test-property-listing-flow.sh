#!/bin/bash

echo "========================================="
echo "Property Listing Flow - Test Script"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URLs
AUTH_URL="http://localhost:7072/api/auth"
VENDOR_URL="http://localhost:8084/api/vendors"
PROPERTY_URL="http://localhost:8083/api/properties"

echo -e "${YELLOW}Step 1: Register User with VENDOR role${NC}"
echo "--------------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST $AUTH_URL/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testvendor@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "Vendor",
    "phone": "+254700000001",
    "role": "VENDOR"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.userId')
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken')

if [ "$USER_ID" != "null" ]; then
  echo -e "${GREEN}✓ User created successfully with ID: $USER_ID${NC}"
else
  echo -e "${RED}✗ User registration failed${NC}"
  exit 1
fi
echo ""

echo -e "${YELLOW}Step 2: Register Vendor Profile${NC}"
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
    \"email\": \"testvendor@example.com\",
    \"phone\": \"+254700000001\",
    \"address\": \"123 Test Street, Nairobi\",
    \"county\": \"Nairobi\",
    \"subCounty\": \"Westlands\",
    \"idNumber\": \"12345678\"
  }")

echo "$VENDOR_RESPONSE" | jq '.'
VENDOR_ID=$(echo "$VENDOR_RESPONSE" | jq -r '.id')

if [ "$VENDOR_ID" != "null" ]; then
  echo -e "${GREEN}✓ Vendor created successfully with ID: $VENDOR_ID${NC}"
else
  echo -e "${RED}✗ Vendor registration failed${NC}"
  exit 1
fi
echo ""

echo -e "${YELLOW}Step 3: Create Property Listing${NC}"
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

echo "$PROPERTY_RESPONSE" | jq '.'
PROPERTY_ID=$(echo "$PROPERTY_RESPONSE" | jq -r '.id')

if [ "$PROPERTY_ID" != "null" ]; then
  echo -e "${GREEN}✓ Property created successfully with ID: $PROPERTY_ID${NC}"
else
  echo -e "${RED}✗ Property creation failed${NC}"
  exit 1
fi
echo ""

echo -e "${YELLOW}Step 4: Send OTP to Vendor${NC}"
echo "--------------------------------------"
OTP_RESPONSE=$(curl -s -X POST $AUTH_URL/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "testvendor@example.com"}')

echo "$OTP_RESPONSE"
echo -e "${GREEN}✓ OTP sent (check auth service logs for OTP code)${NC}"
echo ""

echo -e "${YELLOW}Step 5: Get Vendor Properties${NC}"
echo "--------------------------------------"
VENDOR_PROPS=$(curl -s -X GET "$PROPERTY_URL/vendor/$VENDOR_ID?page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$VENDOR_PROPS" | jq '.'
PROP_COUNT=$(echo "$VENDOR_PROPS" | jq -r '.content | length')
echo -e "${GREEN}✓ Vendor has $PROP_COUNT property(ies)${NC}"
echo ""

echo -e "${YELLOW}Step 6: Get Pending Properties (Admin View)${NC}"
echo "--------------------------------------"
# Login as admin first
ADMIN_LOGIN=$(curl -s -X POST $AUTH_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@gmail.com",
    "password": "admin@123"
  }')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.accessToken')

if [ "$ADMIN_TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Admin logged in successfully${NC}"
  
  PENDING_PROPS=$(curl -s -X GET "$PROPERTY_URL/pending?page=0&size=10" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  echo "$PENDING_PROPS" | jq '.'
  PENDING_COUNT=$(echo "$PENDING_PROPS" | jq -r '.content | length')
  echo -e "${GREEN}✓ Found $PENDING_COUNT pending property(ies)${NC}"
else
  echo -e "${RED}✗ Admin login failed${NC}"
fi
echo ""

echo -e "${YELLOW}Step 7: Approve Property${NC}"
echo "--------------------------------------"
if [ "$ADMIN_TOKEN" != "null" ] && [ "$PROPERTY_ID" != "null" ]; then
  APPROVE_RESPONSE=$(curl -s -X PUT "$PROPERTY_URL/$PROPERTY_ID/approve" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  echo "$APPROVE_RESPONSE" | jq '.'
  STATUS=$(echo "$APPROVE_RESPONSE" | jq -r '.status')
  
  if [ "$STATUS" == "ACTIVE" ]; then
    echo -e "${GREEN}✓ Property approved successfully - Status: $STATUS${NC}"
  else
    echo -e "${RED}✗ Property approval failed${NC}"
  fi
else
  echo -e "${RED}✗ Cannot approve - missing admin token or property ID${NC}"
fi
echo ""

echo "========================================="
echo -e "${GREEN}Test Flow Complete!${NC}"
echo "========================================="
echo ""
echo "Summary:"
echo "- User ID: $USER_ID"
echo "- Vendor ID: $VENDOR_ID"
echo "- Property ID: $PROPERTY_ID"
echo "- Property Status: ACTIVE (if approved)"
echo ""
echo "Next Steps:"
echo "1. Check auth service logs for OTP code"
echo "2. Test vendor login at: http://localhost:5173/vendor-login"
echo "3. View vendor dashboard at: http://localhost:5173/VendorDashboard"
echo "4. View admin dashboard at: http://localhost:5173/AdminDashboard"
echo "5. View property on homepage: http://localhost:5173/"
echo ""
