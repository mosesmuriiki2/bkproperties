# Running GlobalHub - Complete Guide

## System Requirements

- **Node.js**: 18+ (for frontend)
- **Java**: 11+ (for backend)
- **MySQL**: 8.0+ (for database)
- **Maven**: 3.8+ (for building backend)

## Quick Start (3 Steps)

### Step 1: Start MySQL Database
```bash
# Make sure MySQL is running
mysql -u root -p

# Create databases (run in MySQL)
source backend/database-schema.sql
```

### Step 2: Start Backend Services
```bash
cd backend
./build-and-run-all.sh
```

This will start all 9 services:
- Eureka (7070)
- Gateway (7071)
- Auth (7072)
- User (7073)
- Vendor (7074)
- Product (7075)
- Hotel (7076)
- Property (7086)
- Tour (7087)

### Step 3: Start Frontend
```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## Detailed Setup

### 1. Database Setup

#### Option A: Using MySQL CLI
```bash
mysql -u root -p < backend/database-schema.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `backend/database-schema.sql`
4. Execute the script

#### Verify Databases Created
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'globalhub%';"
```

Expected output:
```
+---------------------+
| Database            |
+---------------------+
| globalhub_auth      |
| globalhub_users     |
| globalhub_vendors   |
| globalhub_products  |
| globalhub_hotels    |
| globalhub_properties|
| globalhub_tours     |
+---------------------+
```

### 2. Backend Setup

#### Build All Services
```bash
cd backend
mvn clean package -DskipTests
```

#### Run Individual Services (if not using build-and-run-all.sh)
```bash
# Terminal 1: Eureka
java -jar globalhub-eureka/target/globalhub-eureka-1.0.0-SNAPSHOT.jar

# Terminal 2: Gateway
java -jar globalhub-gateway/target/globalhub-gateway-1.0.0-SNAPSHOT.jar

# Terminal 3: Auth Service
java -jar globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar

# Terminal 4: User Service
java -jar globalhub-user-service/target/globalhub-user-service-1.0.0-SNAPSHOT.jar

# Terminal 5: Vendor Service
java -jar globalhub-vendor-service/target/globalhub-vendor-service-1.0.0-SNAPSHOT.jar

# Terminal 6: Product Service
java -jar globalhub-product-service/target/globalhub-product-service-1.0.0-SNAPSHOT.jar

# Terminal 7: Hotel Service
java -jar globalhub-hotel-service/target/globalhub-hotel-service-1.0.0-SNAPSHOT.jar

# Terminal 8: Property Service
java -jar globalhub-property-service/target/globalhub-property-service-1.0.0-SNAPSHOT.jar

# Terminal 9: Tour Service
java -jar globalhub-tour-service/target/globalhub-tour-service-1.0.0-SNAPSHOT.jar
```

#### Verify Services Running
```bash
# Check Eureka
curl http://localhost:7070

# Check Gateway
curl http://localhost:7071

# Check Auth Service
curl http://localhost:7072/swagger-ui.html
```

### 3. Frontend Setup

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

#### Access Frontend
Open browser and go to: **http://localhost:5173**

---

## Service Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Eureka | 7070 | http://localhost:7070 |
| Gateway | 7071 | http://localhost:7071 |
| Auth | 7072 | http://localhost:7072/swagger-ui.html |
| User | 7073 | http://localhost:7073/swagger-ui.html |
| Vendor | 7074 | http://localhost:7074/swagger-ui.html |
| Product | 7075 | http://localhost:7075/swagger-ui.html |
| Hotel | 7076 | http://localhost:7076/swagger-ui.html |
| Property | 7086 | http://localhost:7086/swagger-ui.html |
| Tour | 7087 | http://localhost:7087/swagger-ui.html |
| MySQL | 3306 | localhost:3306 |
| Frontend | 5173 | http://localhost:5173 |

---

## Test Credentials

### Consumer Account
- **Email**: consumer@example.com
- **Password**: password

### Vendor Account
- **Email**: vendor@example.com
- **Password**: password

### Admin Account
- **Email**: admin@example.com
- **Password**: password

---

## Testing the System

### 1. Test Frontend
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create a test account
4. Login with your credentials
5. Browse marketplace

### 2. Test API Endpoints
```bash
# Register
curl -X POST http://localhost:7071/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+254712345678",
    "role": "CONSUMER"
  }'

# Login
curl -X POST http://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Hotels
curl http://localhost:7071/api/hotels

# Get Properties
curl http://localhost:7071/api/properties

# Get Tours
curl http://localhost:7071/api/tours
```

### 3. Test Swagger Documentation
- Auth Service: http://localhost:7072/swagger-ui.html
- User Service: http://localhost:7073/swagger-ui.html
- Vendor Service: http://localhost:7074/swagger-ui.html
- Product Service: http://localhost:7075/swagger-ui.html
- Hotel Service: http://localhost:7076/swagger-ui.html
- Property Service: http://localhost:7086/swagger-ui.html
- Tour Service: http://localhost:7087/swagger-ui.html

---

## Troubleshooting

### Frontend Warning: "Proxy not enabled"
**Status**: ✅ Normal - This is just informational
**Solution**: No action needed. The frontend uses custom API client, not Base44 proxy.

### Backend: "Cannot find symbol: parserBuilder()"
**Status**: ✅ Fixed
**Solution**: Already fixed in JWT_FIX_SUMMARY.md. Java version updated to 11.

### MySQL Connection Error
**Solution**:
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `application.yml` files
3. Verify databases exist: `SHOW DATABASES;`

### Port Already in Use
**Solution**:
```bash
# Find process using port
lsof -i :7071

# Kill process
kill -9 <PID>
```

### Services Not Registering with Eureka
**Solution**:
1. Check Eureka is running: http://localhost:7070
2. Check service logs for errors
3. Verify `eureka.client.service-url.defaultZone` in application.yml

---

## Development Workflow

### Making Changes to Frontend
1. Edit files in `src/`
2. Vite will hot-reload automatically
3. Check browser console for errors

### Making Changes to Backend
1. Edit Java files
2. Rebuild service: `mvn clean package -DskipTests`
3. Restart service
4. Check logs for errors

### Adding New API Endpoints
1. Create controller in service
2. Add Swagger annotations
3. Rebuild and restart service
4. Test via Swagger UI or curl

---

## Production Deployment

### Build for Production
```bash
# Frontend
npm run build

# Backend
mvn clean package

# Docker
docker-compose up -d
```

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:7071
JWT_SECRET=your-secret-key-min-32-chars
DB_PASSWORD=your-db-password
```

---

## Monitoring

### Check Service Health
```bash
# Eureka Dashboard
http://localhost:7070

# Service Logs
tail -f backend/globalhub-auth-service/target/logs/app.log
```

### Monitor Database
```bash
# Connect to MySQL
mysql -u root -p

# Check tables
USE globalhub_auth;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

---

## Common Commands

### Start Everything
```bash
# Terminal 1
cd backend && ./build-and-run-all.sh

# Terminal 2
npm run dev
```

### Stop Everything
```bash
# Kill all Java processes
pkill -f "java.*globalhub"

# Stop frontend (Ctrl+C in terminal)
```

### Clean Build
```bash
# Backend
cd backend && mvn clean

# Frontend
rm -rf node_modules && npm install
```

### View Logs
```bash
# Auth Service
tail -f backend/globalhub-auth-service/target/logs/app.log

# All services
tail -f backend/*/target/logs/app.log
```

---

## Next Steps

1. ✅ Start the system (follow Quick Start above)
2. ✅ Test authentication (register and login)
3. ✅ Browse marketplace pages
4. ✅ Test API endpoints
5. ✅ Review Swagger documentation
6. ✅ Check database for created records

---

## Support

For issues:
1. Check logs: `tail -f backend/*/target/logs/app.log`
2. Check browser console: F12 → Console
3. Review documentation: See DOCUMENTATION_INDEX.md
4. Check service health: http://localhost:7070

---

**Status**: ✅ Ready to Run
**Last Updated**: March 10, 2026
