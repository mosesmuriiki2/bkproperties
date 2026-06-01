# Quick Reference Guide

## Service Ports
- **Eureka**: 7070 (http://localhost:7070)
- **Gateway**: 7071 (http://localhost:7071)
- **Auth**: 7072 (http://localhost:7072)
- **User**: 7073 (http://localhost:7073)
- **Vendor**: 7074 (http://localhost:7074)
- **Product**: 7075 (http://localhost:7075)
- **Hotel**: 7076 (http://localhost:7076)
- **Frontend**: 5173 (http://localhost:5173)

## API Base URL
```
http://localhost:7071/api
```

## Authentication Endpoints

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response:
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CONSUMER",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Login successful"
}
```

### Refresh Token
```bash
POST /api/auth/refresh?refreshToken=YOUR_REFRESH_TOKEN
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Validate Token
```bash
POST /api/auth/validate?token=YOUR_ACCESS_TOKEN
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Hotel Endpoints

### Get All Hotels
```bash
GET /api/hotels
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Hotel by ID
```bash
GET /api/hotels/{hotelId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Search Hotels
```bash
POST /api/hotels/search
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "city": "Nairobi",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-17",
  "guests": 2
}
```

### Get Hotel Rooms
```bash
GET /api/hotels/{hotelId}/rooms
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Book Hotel
```bash
POST /api/hotels/bookings
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "hotelId": 1,
  "roomId": 1,
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-17",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "numberOfGuests": 2
}
```

## User Endpoints

### Get User Profile
```bash
GET /api/users/{userId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update User Profile
```bash
PUT /api/users/{userId}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

### Get User Addresses
```bash
GET /api/users/{userId}/addresses
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Add Address
```bash
POST /api/users/{userId}/addresses
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "street": "123 Main St",
  "city": "Nairobi",
  "state": "Nairobi",
  "zipCode": "00100",
  "country": "Kenya",
  "isDefault": true
}
```

## Product Endpoints

### Get All Products
```bash
GET /api/products
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Search Products
```bash
GET /api/products/search?q=laptop
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Filter Products
```bash
GET /api/products/filter?category=electronics&minPrice=100&maxPrice=1000
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Product by ID
```bash
GET /api/products/{productId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Vendor Endpoints

### Register Vendor
```bash
POST /api/vendors/register
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "businessName": "Tech Store",
  "businessEmail": "store@example.com",
  "businessPhone": "+254712345678",
  "businessAddress": "123 Business St"
}
```

### Get All Vendors
```bash
GET /api/vendors
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Vendor by ID
```bash
GET /api/vendors/{vendorId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Vendor Products
```bash
GET /api/vendors/{vendorId}/products
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Vendor Analytics
```bash
GET /api/vendors/{vendorId}/analytics
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Frontend API Usage

### Import API Client
```javascript
import api from "@/api/apiClient";
```

### Login
```javascript
const response = await api.auth.login({
  email: "user@example.com",
  password: "Password123!"
});
// Token automatically stored in localStorage
```

### Get Hotels
```javascript
const hotels = await api.hotels.getAll();
```

### Book Hotel
```javascript
const booking = await api.hotels.book({
  hotelId: 1,
  roomId: 1,
  checkInDate: "2024-03-15",
  checkOutDate: "2024-03-17",
  guestName: "John Doe",
  guestEmail: "john@example.com",
  numberOfGuests: 2
});
```

### Get Products
```javascript
const products = await api.products.getAll();
```

### Search Products
```javascript
const results = await api.products.search("laptop");
```

## Swagger UI URLs
- Auth: http://localhost:7072/swagger-ui.html
- User: http://localhost:7073/swagger-ui.html
- Vendor: http://localhost:7074/swagger-ui.html
- Product: http://localhost:7075/swagger-ui.html
- Hotel: http://localhost:7076/swagger-ui.html

## Database Credentials
- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: Password@224

## JWT Configuration
- **Algorithm**: HS512
- **Access Token Expiration**: 1 hour (3600000 ms)
- **Refresh Token Expiration**: 7 days (604800000 ms)
- **Secret**: Change in production!

## Common cURL Commands

### Register User
```bash
curl -X POST http://localhost:7071/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+254712345678"
  }'
```

### Login
```bash
curl -X POST http://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Get Hotels (with token)
```bash
curl http://localhost:7071/api/hotels \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Hotel Booking
```bash
curl -X POST http://localhost:7071/api/hotels/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "hotelId": 1,
    "roomId": 1,
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-17",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "numberOfGuests": 2
  }'
```

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Solution: Login again or refresh token

### 403 Forbidden
- User doesn't have permission
- Solution: Check user role

### 404 Not Found
- Resource doesn't exist
- Solution: Verify resource ID

### 500 Server Error
- Backend error
- Solution: Check service logs

### CORS Error
- Frontend and backend have different origins
- Solution: Check CORS configuration

## Development Workflow

1. **Start Backend Services**
   ```bash
   cd backend
   # Start each service in separate terminal
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Test with Swagger UI**
   - Visit http://localhost:7072/swagger-ui.html
   - Test endpoints directly

4. **Test with Frontend**
   - Visit http://localhost:5173
   - Use the application

5. **Check Logs**
   ```bash
   tail -f backend/globalhub-auth-service/logs/*.log
   ```

## Performance Tips

1. Use pagination for large datasets
2. Cache frequently accessed data
3. Use indexes on database columns
4. Monitor service health regularly
5. Set appropriate connection pool sizes

## Security Tips

1. Change JWT secret in production
2. Use HTTPS in production
3. Implement rate limiting
4. Validate all user inputs
5. Use strong passwords
6. Enable audit logging
7. Regular security audits

## Useful Links

- Eureka Dashboard: http://localhost:7070
- Gateway Health: http://localhost:7071/actuator/health
- Auth Swagger: http://localhost:7072/swagger-ui.html
- Frontend: http://localhost:5173
- MySQL: localhost:3306

## File Locations

- Backend: `backend/`
- Frontend: `src/`
- API Client: `src/api/apiClient.js`
- Auth Service: `backend/globalhub-auth-service/`
- Hotel Service: `backend/globalhub-hotel-service/`
- Documentation: Root directory (*.md files)
