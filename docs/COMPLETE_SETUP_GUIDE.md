# Complete GlobalHub Setup Guide

## Prerequisites

### Required Software
- Java 21 or higher
- MySQL 8.0 or higher
- Node.js 18+ and npm
- Git

### Installation

#### Java 21
```bash
# Ubuntu/Debian
sudo apt-get install openjdk-21-jdk

# macOS
brew install openjdk@21

# Windows
# Download from https://www.oracle.com/java/technologies/downloads/
```

#### MySQL 8.0
```bash
# Ubuntu/Debian
sudo apt-get install mysql-server

# macOS
brew install mysql

# Windows
# Download from https://dev.mysql.com/downloads/mysql/
```

#### Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Download from https://nodejs.org/
```

## Database Setup

### 1. Start MySQL
```bash
# Ubuntu/Debian
sudo systemctl start mysql

# macOS
brew services start mysql

# Windows
# Start MySQL from Services or command line
```

### 2. Create Databases
```bash
mysql -u root -p

# In MySQL shell:
CREATE DATABASE globalhub_auth;
CREATE DATABASE globalhub_user;
CREATE DATABASE globalhub_vendor;
CREATE DATABASE globalhub_product;
CREATE DATABASE globalhub_hotel;
CREATE DATABASE globalhub_property;
CREATE DATABASE globalhub_tour;

# Grant privileges
GRANT ALL PRIVILEGES ON globalhub_*.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Verify Connection
```bash
mysql -u root -p -e "SHOW DATABASES;" | grep globalhub
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Build All Services
```bash
# Build parent pom
mvn clean install -DskipTests

# Or build individual services
cd globalhub-eureka && mvn clean package -DskipTests
cd ../globalhub-gateway && mvn clean package -DskipTests
cd ../globalhub-auth-service && mvn clean package -DskipTests
cd ../globalhub-user-service && mvn clean package -DskipTests
cd ../globalhub-vendor-service && mvn clean package -DskipTests
cd ../globalhub-product-service && mvn clean package -DskipTests
cd ../globalhub-hotel-service && mvn clean package -DskipTests
```

### 3. Start Services (in separate terminals)

#### Terminal 1: Eureka Server
```bash
cd backend/globalhub-eureka
mvn spring-boot:run
# Eureka UI: http://localhost:7070
```

#### Terminal 2: API Gateway
```bash
cd backend/globalhub-gateway
mvn spring-boot:run
# Gateway: http://localhost:7071
```

#### Terminal 3: Auth Service
```bash
cd backend/globalhub-auth-service
mvn spring-boot:run
# Swagger: http://localhost:7072/swagger-ui.html
```

#### Terminal 4: User Service
```bash
cd backend/globalhub-user-service
mvn spring-boot:run
# Swagger: http://localhost:7073/swagger-ui.html
```

#### Terminal 5: Vendor Service
```bash
cd backend/globalhub-vendor-service
mvn spring-boot:run
# Swagger: http://localhost:7074/swagger-ui.html
```

#### Terminal 6: Product Service
```bash
cd backend/globalhub-product-service
mvn spring-boot:run
# Swagger: http://localhost:7075/swagger-ui.html
```

#### Terminal 7: Hotel Service
```bash
cd backend/globalhub-hotel-service
mvn spring-boot:run
# Swagger: http://localhost:7076/swagger-ui.html
```

### 4. Verify Services
```bash
# Check Eureka Dashboard
curl http://localhost:7070

# Check Gateway Health
curl http://localhost:7071/actuator/health

# Check Auth Service Health
curl http://localhost:7072/actuator/health
```

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd src
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
# Frontend: http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
# Output: dist/
```

## Testing the System

### 1. Register a User
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

### 2. Login
```bash
curl -X POST http://localhost:7071/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Get Hotels (with token)
```bash
curl http://localhost:7071/api/hotels \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Access Swagger UI
- Auth Service: http://localhost:7072/swagger-ui.html
- User Service: http://localhost:7073/swagger-ui.html
- Vendor Service: http://localhost:7074/swagger-ui.html
- Product Service: http://localhost:7075/swagger-ui.html
- Hotel Service: http://localhost:7076/swagger-ui.html

## Docker Setup (Optional)

### 1. Build Docker Images
```bash
cd backend
docker-compose build
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Check Logs
```bash
docker-compose logs -f
```

### 4. Stop Services
```bash
docker-compose down
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :7070  # Replace with your port

# Kill process
kill -9 <PID>
```

### MySQL Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in application.yml
# Default: root / Password@224
```

### Eureka Not Registering Services
```bash
# Check service logs for errors
# Verify eureka.client.service-url in application.yml
# Ensure Eureka server is running first
```

### Frontend Can't Connect to Backend
```bash
# Check CORS configuration in backend
# Verify API_BASE_URL in src/api/apiClient.js
# Ensure backend services are running
```

### Token Expired Error
```bash
# Use refresh token endpoint
curl -X POST "http://localhost:7071/api/auth/refresh?refreshToken=YOUR_REFRESH_TOKEN"
```

## Performance Tuning

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_hotel_city ON hotels(city);
CREATE INDEX idx_product_vendor ON products(vendor_id);
```

### JVM Tuning
```bash
# Set heap size for services
export JAVA_OPTS="-Xmx512m -Xms256m"
mvn spring-boot:run
```

### Connection Pool
```yaml
# In application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```

## Monitoring

### Enable Actuator Endpoints
```yaml
# In application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
```

### Check Service Health
```bash
curl http://localhost:7072/actuator/health
curl http://localhost:7073/actuator/health
curl http://localhost:7074/actuator/health
```

### View Metrics
```bash
curl http://localhost:7072/actuator/metrics
```

## Deployment Checklist

- [ ] Update JWT secret in production
- [ ] Configure database credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domains
- [ ] Enable authentication for all endpoints
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Load testing
- [ ] Security audit
- [ ] Performance testing

## Quick Commands

### Start All Services (Linux/macOS)
```bash
#!/bin/bash
cd backend

# Start Eureka
cd globalhub-eureka && mvn spring-boot:run &
sleep 5

# Start Gateway
cd ../globalhub-gateway && mvn spring-boot:run &
sleep 5

# Start other services
cd ../globalhub-auth-service && mvn spring-boot:run &
cd ../globalhub-user-service && mvn spring-boot:run &
cd ../globalhub-vendor-service && mvn spring-boot:run &
cd ../globalhub-product-service && mvn spring-boot:run &
cd ../globalhub-hotel-service && mvn spring-boot:run &

echo "All services started!"
```

### Stop All Services
```bash
pkill -f "spring-boot:run"
```

### View Logs
```bash
# Eureka
tail -f backend/globalhub-eureka/logs/*.log

# Auth Service
tail -f backend/globalhub-auth-service/logs/*.log
```

## Support

For issues or questions:
1. Check the logs in each service directory
2. Review the Swagger documentation
3. Check the troubleshooting section
4. Review the implementation status documents
