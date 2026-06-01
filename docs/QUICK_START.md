# GlobalHub - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+

### Step 1: Setup Database (2 min)

```bash
mysql -u root -p
```

Then paste:
```sql
source backend/database-schema.sql
```

### Step 2: Start Backend Services (3 min)

**Terminal 1**:
```bash
cd backend/globalhub-eureka
mvn spring-boot:run
```

**Terminal 2**:
```bash
cd backend/globalhub-gateway
mvn spring-boot:run
```

**Terminal 3**:
```bash
cd backend/globalhub-auth-service
mvn spring-boot:run
```

### Step 3: Start Frontend (1 min)

```bash
npm install
npm run dev
```

### ✅ Done!

- Frontend: http://localhost:5173
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- Auth Swagger: http://localhost:8081/swagger-ui.html

---

## 🧪 Quick Test

### Test Login via cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test in Browser Console

```javascript
import api from './api/apiClient';
await api.auth.login({email:'test@example.com',password:'password123'});
```

---

## 📋 Service Ports

| Service | Port |
|---------|------|
| Eureka | 8761 |
| Gateway | 8080 |
| Auth | 8081 |
| User | 8082 |
| Vendor | 8083 |
| Product | 8084 |
| Hotel | 8085 |
| Property | 8086 |
| Tour | 8087 |
| Order | 8088 |
| Payment | 8089 |
| Notification | 8090 |

---

## 🔧 Common Commands

### Build All Services
```bash
cd backend && mvn clean install
```

### Run Tests
```bash
mvn test
```

### View Logs
```bash
tail -f backend/globalhub-auth-service/target/logs/*.log
```

### Kill Process on Port
```bash
lsof -i :8080
kill -9 <PID>
```

---

## 📚 Documentation

- **Full Setup**: `backend/BACKEND_SETUP_GUIDE.md`
- **Service Templates**: `backend/SERVICE_IMPLEMENTATION_TEMPLATES.md`
- **Frontend Integration**: `FRONTEND_API_INTEGRATION.md`
- **Status Report**: `BACKEND_FRONTEND_INTEGRATION_STATUS.md`
- **Architecture**: `backend/ARCHITECTURE.md`

---

## 🚀 Next Steps

1. **Implement User Service** (1-2 days)
2. **Implement Vendor Service** (2-3 days)
3. **Implement Product Service** (2-3 days)
4. **Update Frontend Pages** (1-2 days)
5. **Integration Testing** (1-2 days)

---

## ❓ Troubleshooting

### Port Already in Use
```bash
lsof -i :8080
kill -9 <PID>
```

### Database Connection Error
Update credentials in `application.yml`:
```yaml
spring:
  datasource:
    username: your_user
    password: your_password
```

### Service Not Registering
Check Eureka dashboard: http://localhost:8761

### CORS Errors
Ensure CORS is enabled in service configuration.

---

*GlobalHub Quick Start | March 2026*
