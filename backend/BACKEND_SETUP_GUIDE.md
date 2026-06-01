# GlobalHub Backend - Complete Setup & Implementation Guide

## 🔧 CRITICAL FIXES APPLIED

### Port Configuration Fixed ✅
- **Eureka Server**: Now on port **8761** (was 9095)
- **API Gateway**: Now on port **8080** (was 9096)
- **Auth Service**: Now on port **8081** (was 9097)
- **Frontend API Client**: Correctly points to `http://localhost:8080`

### Gateway Routes Configured ✅
All 12 services now have proper route definitions in the API Gateway.

---

## 📋 Prerequisites

### Required Software
- **Java 17+** - Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.8+** - Download from [maven.apache.org](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - Download from [mysql.com](https://www.mysql.com/downloads/)
- **Git** - For version control

### Verify Installation
```bash
java -version          # Should show Java 17+
mvn -version          # Should show Maven 3.8+
mysql --version       # Should show MySQL 8.0+
```

---

## 🗄️ Database Setup

### Step 1: Create Databases

Open MySQL and run:

```bash
mysql -u root -p
```

Then execute the database schema:

```bash
source backend/database-schema.sql
```

Or manually create databases:

```sql
CREATE DATABASE IF NOT EXISTS globalhub_auth;
CREATE DATABASE IF NOT EXISTS globalhub_users;
CREATE DATABASE IF NOT EXISTS globalhub_vendors;
CREATE DATABASE IF NOT EXISTS globalhub_products;
CREATE DATABASE IF NOT EXISTS globalhub_hotels;
CREATE DATABASE IF NOT EXISTS globalhub_properties;
CREATE DATABASE IF NOT EXISTS globalhub_tours;
CREATE DATABASE IF NOT EXISTS globalhub_orders;
CREATE DATABASE IF NOT EXISTS globalhub_payments;
CREATE DATABASE IF NOT EXISTS globalhub_notifications;
```

### Step 2: Verify Databases

```sql
SHOW DATABASES;
```

You should see all 10 globalhub databases.

---

## 🚀 Backend Startup Sequence

### Terminal 1: Start Eureka Server

```bash
cd backend/globalhub-eureka
mvn spring-boot:run
```

**Expected Output:**
```
Started EurekaServerApplication in X seconds
Eureka Server started on port 8761
```

**Access Dashboard**: http://localhost:8761

---

### Terminal 2: Start API Gateway

```bash
cd backend/globalhub-gateway
mvn spring-boot:run
```

**Expected Output:**
```
Started GatewayApplication in X seconds
API Gateway started on port 8080
```

---

### Terminal 3: Start Auth Service

```bash
cd backend/globalhub-auth-service
mvn spring-boot:run
```

**Expected Output:**
```
Started AuthServiceApplication in X seconds
Auth Service started on port 8081
```

**Access Swagger**: http://localhost:8081/swagger-ui.html

---

### Terminal 4+: Start Other Services (As Implemented)

```bash
# User Service (when ready)
cd backend/globalhub-user-service
mvn spring-boot:run

# Vendor Service (when ready)
cd backend/globalhub-vendor-service
mvn spring-boot:run

# Product Service (when ready)
cd backend/globalhub-product-service
mvn spring-boot:run

# And so on...
```

---

## ✅ Verification Checklist

### 1. Eureka Dashboard
- [ ] Visit http://localhost:8761
- [ ] Should show registered services
- [ ] Auth Service should appear as "AUTH-SERVICE"

### 2. API Gateway Health
- [ ] Visit http://localhost:8080/actuator/health
- [ ] Should return `{"status":"UP"}`

### 3. Auth Service Swagger
- [ ] Visit http://localhost:8081/swagger-ui.html
- [ ] Should show auth endpoints

### 4. Test Login Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🔌 Frontend Integration

### Step 1: Start Frontend

```bash
npm install
npm run dev
```

Frontend will run on http://localhost:5173

### Step 2: Test API Connection

Open browser console and test:

```javascript
import api from './api/apiClient';

// Test login
api.auth.login({
  email: 'test@example.com',
  password: 'password123'
}).then(response => console.log('Login successful:', response))
  .catch(error => console.error('Login failed:', error));
```

---

## 📊 Service Implementation Status

| Service | Port | Status | Priority |
|---------|------|--------|----------|
| Eureka | 8761 | ✅ Complete | - |
| Gateway | 8080 | ✅ Complete | - |
| Auth | 8081 | ✅ Complete | - |
| User | 8082 | ⏳ Stub | HIGH |
| Vendor | 8083 | ⏳ Stub | HIGH |
| Product | 8084 | ⏳ Stub | HIGH |
| Hotel | 8085 | ⏳ Stub | MEDIUM |
| Property | 8086 | ⏳ Stub | MEDIUM |
| Tour | 8087 | ⏳ Stub | MEDIUM |
| Order | 8088 | ⏳ Stub | MEDIUM |
| Payment | 8089 | ⏳ Stub | MEDIUM |
| Notification | 8090 | ⏳ Stub | LOW |

---

## 🛠️ Implementing Missing Services

### Template for New Service

Each service follows this pattern:

```
globalhub-{service}-service/
├── pom.xml
├── src/main/
│   ├── java/com/globalhub/{service}/
│   │   ├── {Service}Application.java
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── dto/
│   │   └── exception/
│   └── resources/
│       └── application.yml
└── src/test/
```

### Quick Implementation Steps

1. **Copy Auth Service as Template**
   ```bash
   cp -r globalhub-auth-service globalhub-user-service
   ```

2. **Update Configuration**
   - Change port in `application.yml`
   - Update database name
   - Update service name in `spring.application.name`

3. **Implement Domain Logic**
   - Create entities for the service
   - Create repositories
   - Create service layer
   - Create controllers

4. **Test**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

---

## 🧪 Testing APIs

### Using cURL

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"Password123!",
    "firstName":"John",
    "lastName":"Doe"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"Password123!"
  }'
```

### Using Postman

1. Import the Postman collection (if available)
2. Set base URL to `http://localhost:8080`
3. Test each endpoint

### Using Swagger UI

1. Visit http://localhost:8081/swagger-ui.html
2. Click "Try it out" on any endpoint
3. Fill in parameters and execute

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Error

```
Error: Access denied for user 'root'@'localhost'
```

**Solution**: Update credentials in `application.yml`:
```yaml
spring:
  datasource:
    username: your_mysql_user
    password: your_mysql_password
```

### Service Not Registering with Eureka

1. Check Eureka dashboard: http://localhost:8761
2. Verify service is running
3. Check logs for errors
4. Ensure `eureka.client.service-url.defaultZone` is correct

### CORS Errors in Frontend

Ensure CORS is enabled in each service's configuration.

---

## 📈 Next Steps

### Phase 1: Core Services (This Week)
- [ ] Implement User Service
- [ ] Implement Vendor Service
- [ ] Implement Product Service
- [ ] Update frontend pages to use API

### Phase 2: Booking Services (Next Week)
- [ ] Implement Hotel Service
- [ ] Implement Property Service
- [ ] Implement Tour Service

### Phase 3: Transaction Services (Following Week)
- [ ] Implement Order Service
- [ ] Implement Payment Service
- [ ] Implement Notification Service

### Phase 4: Integration & Testing
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Deployment preparation

---

## 📚 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Implementation Status**: See `IMPLEMENTATION_STATUS.md`
- **API Endpoints**: See individual service Swagger docs

---

## 🆘 Support

If you encounter issues:

1. Check service logs
2. Verify database connectivity
3. Check Eureka dashboard
4. Review error messages carefully
5. Consult documentation files

---

*Last Updated: March 10, 2026*
*Status: Ready for Service Implementation*
