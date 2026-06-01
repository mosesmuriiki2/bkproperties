# GlobalHub Backend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### **Prerequisites**
- ✅ Java 17 or higher
- ✅ Maven 3.8+
- ✅ PostgreSQL 15+
- ✅ Node.js (for frontend)

---

## ⚡ Quick Setup

### **Option 1: Manual Setup (Recommended for Development)**

```bash
# Navigate to backend directory
cd backend

# Step 1: Create databases
psql -U postgres -c "CREATE DATABASE globalhub_auth;"
psql -U postgres -c "CREATE DATABASE globalhub_users;"
# ... repeat for all services (see setup.sh)

# Step 2: Build all services
mvn clean install -DskipTests

# Step 3: Start Eureka Server
cd globalhub-eureka
mvn spring-boot:run

# In new terminal - Start API Gateway
cd backend/globalhub-gateway
mvn spring-boot:run

# In new terminals - Start business services
cd backend/globalhub-auth-service
mvn spring-boot:run
# Repeat for other services
```

### **Option 2: Using Scripts (Easiest)**

```bash
cd backend

# Make scripts executable
chmod +x setup.sh start-all.sh stop-all.sh

# Run setup (creates DBs and builds)
./setup.sh

# Start all services
./start-all.sh

# To stop
./stop-all.sh
```

### **Option 3: Docker (Production-like Environment)**

```bash
cd backend

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## 🔗 Service Ports Reference

| Service | Port | Purpose |
|---------|------|---------|
| **Eureka Server** | 8761 | Service discovery dashboard |
| **API Gateway** | 8080 | Single entry point for all requests |
| **Auth Service** | 8081 | Authentication & JWT |
| **User Service** | 8082 | User profiles & management |
| **Vendor Service** | 8083 | Vendor registration & management |
| **Product Service** | 8084 | Product catalog |
| **Hotel Service** | 8085 | Hotel listings & bookings |
| **Property Service** | 8086 | Real estate listings |
| **Tour Service** | 8087 | Tour packages & vehicles |
| **Order Service** | 8088 | Order processing |
| **Payment Service** | 8089 | Payment processing (Stripe) |
| **Notification Service** | 8090 | Email/SMS notifications |

---

## 🌐 Frontend Integration

### **Update API Client**

The frontend is already configured! Just ensure the backend is running.

**File**: `src/api/apiClient.js`

```javascript
const API_BASE_URL = 'http://localhost:8080'; // Points to Gateway
```

### **Example Usage**

```jsx
import api from '../api/apiClient';

// Login
const handleLogin = async (email, password) => {
  const response = await api.auth.login({ email, password });
  console.log('Logged in:', response.email);
};

// Get products
const products = await api.products.getAll();

// Search hotels
const hotels = await api.hotels.search({
  location: 'Paris',
  checkIn: '2024-04-01',
  checkOut: '2024-04-05'
});

// Create order
const order = await api.orders.create({
  items: cartItems,
  total: calculateTotal()
});
```

---

## 🔍 Monitoring Services

### **Eureka Dashboard**
Open: http://localhost:8761

View all registered services and their health status.

### **Swagger Documentation**

Each service has interactive API docs:
- Auth: http://localhost:8081/swagger-ui.html
- Products: http://localhost:8084/swagger-ui.html
- Hotels: http://localhost:8085/swagger-ui.html

### **Logs**

```bash
# View service logs
tail -f backend/logs/auth-service.log

# Docker logs
docker-compose logs -f auth-service
```

---

## 🗄️ Database Setup

All services use PostgreSQL. Create databases:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create databases for each service
CREATE DATABASE globalhub_auth;
CREATE DATABASE globalhub_users;
CREATE DATABASE globalhub_vendors;
CREATE DATABASE globalhub_products;
CREATE DATABASE globalhub_hotels;
CREATE DATABASE globalhub_properties;
CREATE DATABASE globalhub_tours;
CREATE DATABASE globalhub_orders;
CREATE DATABASE globalhub_payments;

-- List databases
\l
```

---

## 🔧 Configuration

### **Database Credentials**

Edit `src/main/resources/application.yml` in each service:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/globalhub_{service}
    username: postgres
    password: your_password
```

### **JWT Secret**

Edit in `globalhub-auth-service/src/main/resources/application.yml`:

```yaml
app:
  jwt:
    secret: your-super-secret-key-min-32-characters-long
```

---

## 📦 Building Individual Services

```bash
# Build specific service
cd globalhub-auth-service
mvn clean package

# Run specific service
mvn spring-boot:run
```

---

## 🧪 Testing

```bash
# Run tests for all services
mvn test

# Run tests for specific service
cd globalhub-auth-service
mvn test

# Skip tests during build
mvn clean install -DskipTests
```

---

## 🐛 Troubleshooting

### **Port Already in Use**

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### **Service Won't Start**

1. Check database connection
2. Verify Eureka is running first
3. Check logs: `backend/logs/{service}.log`
4. Ensure port is not in use

### **Cannot Connect to Frontend**

1. Verify API Gateway is running on port 8080
2. Check CORS configuration in gateway
3. Ensure frontend uses correct base URL: `http://localhost:8080`

### **Database Connection Error**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📝 API Examples

### **Register User**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### **Login**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### **Get Products**

```bash
curl http://localhost:8080/api/products
```

### **Search Hotels**

```bash
curl -X POST http://localhost:8080/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Paris",
    "checkIn": "2024-04-01",
    "checkOut": "2024-04-05",
    "guests": 2
  }'
```

---

## 🎯 Development Workflow

1. **Start Infrastructure**
   - PostgreSQL
   - Redis (optional)
   - RabbitMQ (optional)

2. **Start Eureka Server**
   ```bash
   cd globalhub-eureka && mvn spring-boot:run
   ```

3. **Start API Gateway**
   ```bash
   cd globalhub-gateway && mvn spring-boot:run
   ```

4. **Start Required Business Services**
   - Only start services you're working on
   - Others can be started as needed

5. **Develop & Test**
   - Use Swagger UI for API testing
   - Use Postman or curl for manual testing
   - Write unit tests

6. **Hot Reload**
   - Changes to Java code require restart
   - Use Spring DevTools for faster restarts

---

## 🚀 Production Deployment

### **Build JAR Files**

```bash
mvn clean package
```

### **Run JAR**

```bash
java -jar globalhub-auth-service/target/globalhub-auth-service-1.0.0-SNAPSHOT.jar
```

### **Environment Variables**

Set production values:
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=production-db.example.com
export JWT_SECRET=production-secret-key
```

---

## 📞 Next Steps

1. ✅ Start all services
2. ✅ Verify in Eureka dashboard (http://localhost:8761)
3. ✅ Test APIs via Swagger
4. ✅ Connect frontend
5. ✅ Register a test user
6. ✅ Start building features!

---

## 📚 Additional Resources

- **Full Documentation**: See `README.md` in backend root
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Architecture Overview**: See main `README.md`

---

*Happy Coding! 🎉*
