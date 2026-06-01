# Phase 1 Testing Guide

**Services**: User, Vendor, Product  
**Base URL**: http://localhost:8080

---

## 🧪 Quick Test Commands

### 1. User Service Tests

#### Create User Profile
```bash
curl -X POST http://localhost:8080/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Software developer"
  }'
```

#### Get User Profile
```bash
curl http://localhost:8080/api/users/1
```

#### Update User Profile
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+0987654321"
  }'
```

#### Add Address
```bash
curl -X POST http://localhost:8080/api/users/1/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "type": "HOME",
    "label": "My Home",
    "street": "123 Main Street",
    "apartment": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "isDefault": true
  }'
```

#### Get All Addresses
```bash
curl http://localhost:8080/api/users/1/addresses
```

#### Update Address
```bash
curl -X PUT http://localhost:8080/api/users/addresses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "WORK",
    "label": "Office",
    "street": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "postalCode": "10002",
    "country": "USA"
  }'
```

#### Delete Address
```bash
curl -X DELETE http://localhost:8080/api/users/addresses/1
```

---

### 2. Vendor Service Tests

#### Register Vendor
```bash
curl -X POST http://localhost:8080/api/vendors/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "businessName": "Tech Store Inc",
    "businessType": "RETAIL",
    "taxNumber": "TAX123456",
    "email": "contact@techstore.com",
    "phone": "+1234567890",
    "address": "789 Commerce St, New York, NY",
    "website": "https://techstore.com",
    "description": "Leading electronics retailer"
  }'
```

#### Get Vendor by ID
```bash
curl http://localhost:8080/api/vendors/1
```

#### Get Vendor by User ID
```bash
curl http://localhost:8080/api/vendors/user/2
```

#### Get All Vendors
```bash
curl http://localhost:8080/api/vendors
```

#### Get Vendors by Status
```bash
curl http://localhost:8080/api/vendors/status/APPROVED
```

#### Update Vendor
```bash
curl -X PUT http://localhost:8080/api/vendors/1 \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Tech Store Plus",
    "description": "Premium electronics retailer"
  }'
```

#### Update Vendor Status (Admin)
```bash
curl -X PUT "http://localhost:8080/api/vendors/1/status?status=APPROVED" \
  -H "Content-Type: application/json"
```

#### Upload Vendor Document
```bash
curl -X POST http://localhost:8080/api/vendors/1/documents \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "TAX_CERTIFICATE",
    "documentUrl": "https://storage.example.com/tax-cert-123.pdf"
  }'
```

#### Get Vendor Documents
```bash
curl http://localhost:8080/api/vendors/1/documents
```

#### Delete Vendor
```bash
curl -X DELETE http://localhost:8080/api/vendors/1
```

---

### 3. Product Service Tests

#### Create Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": 1,
    "name": "MacBook Pro 16",
    "category": "Laptops",
    "price": 2499.99,
    "stockQuantity": 50,
    "description": "High-performance laptop with M1 Pro chip",
    "images": [
      "https://example.com/macbook-1.jpg",
      "https://example.com/macbook-2.jpg"
    ]
  }'
```

#### Get Product by ID
```bash
curl http://localhost:8080/api/products/1
```

#### Get All Products
```bash
curl http://localhost:8080/api/products
```

#### Get Products by Vendor
```bash
curl http://localhost:8080/api/products/vendor/1
```

#### Get Products by Category
```bash
curl http://localhost:8080/api/products/category/Laptops
```

#### Search Products
```bash
curl "http://localhost:8080/api/products/search?q=MacBook"
```

#### Filter by Price Range
```bash
curl "http://localhost:8080/api/products/price-range?minPrice=1000&maxPrice=3000"
```

#### Advanced Filter (Category + Price)
```bash
curl "http://localhost:8080/api/products/filter?category=Laptops&minPrice=1000&maxPrice=3000"
```

#### Update Product
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 16 M2",
    "price": 2699.99,
    "stockQuantity": 45,
    "description": "Updated with M2 Pro chip"
  }'
```

#### Delete Product
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

---

## 🧪 Postman Collection

### Import into Postman

Create a new collection with these requests:

**User Service**
- POST /api/users/{userId}/profile
- GET /api/users/{userId}
- PUT /api/users/{userId}
- DELETE /api/users/{userId}
- POST /api/users/{userId}/addresses
- GET /api/users/{userId}/addresses
- GET /api/users/addresses/{addressId}
- PUT /api/users/addresses/{addressId}
- DELETE /api/users/addresses/{addressId}

**Vendor Service**
- POST /api/vendors/register
- GET /api/vendors
- GET /api/vendors/{id}
- GET /api/vendors/user/{userId}
- GET /api/vendors/status/{status}
- PUT /api/vendors/{id}
- PUT /api/vendors/{id}/status
- DELETE /api/vendors/{id}
- POST /api/vendors/{vendorId}/documents
- GET /api/vendors/{vendorId}/documents

**Product Service**
- POST /api/products
- GET /api/products
- GET /api/products/{id}
- GET /api/products/vendor/{vendorId}
- GET /api/products/category/{category}
- GET /api/products/search
- GET /api/products/price-range
- GET /api/products/filter
- PUT /api/products/{id}
- DELETE /api/products/{id}

---

## 🌐 Swagger UI Testing

### Access Swagger Documentation

**User Service**:
http://localhost:8082/swagger-ui.html

**Vendor Service**:
http://localhost:8083/swagger-ui.html

**Product Service**:
http://localhost:8084/swagger-ui.html

### How to Test in Swagger
1. Open the Swagger UI URL
2. Click on an endpoint
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"
6. View the response

---

## 📊 Test Scenarios

### Scenario 1: Complete User Journey
1. Create user profile
2. Add home address
3. Add work address
4. Set home as default
5. Update profile
6. Get all addresses

### Scenario 2: Vendor Registration
1. Register vendor
2. Upload tax certificate
3. Upload business license
4. Check vendor status
5. Update vendor info
6. Approve vendor (admin)

### Scenario 3: Product Catalog
1. Create multiple products
2. Search by name
3. Filter by category
4. Filter by price range
5. Update product stock
6. Delete product

### Scenario 4: Advanced Search
1. Create products in different categories
2. Search for "laptop"
3. Filter laptops by price (1000-3000)
4. Get products by vendor
5. Get all products in category

---

## ✅ Expected Responses

### Success Response (201 Created)
```json
{
  "id": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Software developer",
  "addresses": [],
  "createdAt": "2026-03-10T10:30:00",
  "updatedAt": "2026-03-10T10:30:00"
}
```

### Success Response (200 OK)
```json
{
  "id": 1,
  "name": "MacBook Pro 16",
  "category": "Laptops",
  "price": 2499.99,
  "stockQuantity": 50,
  "status": "ACTIVE",
  "vendorId": 1,
  "description": "High-performance laptop",
  "images": ["url1", "url2"],
  "createdAt": "2026-03-10T10:30:00",
  "updatedAt": "2026-03-10T10:30:00"
}
```

### Error Response (404 Not Found)
```json
{
  "timestamp": "2026-03-10T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 999"
}
```

---

## 🐛 Troubleshooting

### Service Not Running
```bash
# Check if service is running
curl http://localhost:8082/actuator/health

# If not running, start it
cd backend/globalhub-user-service
mvn spring-boot:run
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check credentials in application.yml
```

### Port Already in Use
```bash
# Find process using port
lsof -i :8082

# Kill process
kill -9 <PID>
```

### CORS Errors
- Ensure CORS is enabled in service
- Check allowed origins in CorsConfig
- Verify frontend URL is in allowed list

---

## 📈 Performance Testing

### Load Test User Service
```bash
# Create 100 users
for i in {1..100}; do
  curl -X POST http://localhost:8080/api/users/$i/profile \
    -H "Content-Type: application/json" \
    -d "{\"firstName\":\"User$i\",\"lastName\":\"Test\"}"
done
```

### Load Test Product Search
```bash
# Search 100 times
for i in {1..100}; do
  curl "http://localhost:8080/api/products/search?q=laptop"
done
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in decimal format (e.g., 2499.99)
- IDs are auto-generated by database
- Status codes follow HTTP standards
- All endpoints support JSON request/response

---

*Phase 1 Testing Guide | GlobalHub Backend | March 10, 2026*
