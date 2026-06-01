# 🌐 Frontend URL Configuration Guide

## ✅ Default Frontend URLs Updated

The frontend has been configured to connect to your backend microservices.

---

## 🔧 Current Configuration

### **Frontend → Backend Connection**

**File:** `src/api/apiClient.js`

```javascript
// API Gateway runs on port 9096
const API_BASE_URL = 'http://localhost:9096';
```

**This means:**
- Frontend runs on: **http://localhost:5173** (Vite default)
- Backend Gateway runs on: **http://localhost:9096**
- All API calls go through the Gateway

---

## 📋 Complete URL Map

### **Frontend (React + Vite)**

| Environment | URL | Description |
|-------------|-----|-------------|
| **Development** | http://localhost:5173 | Vite dev server |
| **Production Build** | Depends on hosting | Built with `npm run build` |

### **Backend (Spring Boot Microservices)**

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Eureka Server** | 9095 | http://localhost:9095 | Service registry dashboard |
| **API Gateway** | 9096 | http://localhost:9096 | Main entry point for frontend |
| **Auth Service** | 9097 | http://localhost:9097 | Authentication & authorization |
| **User Service** | 9098 | http://localhost:9098 | User management |
| **Vendor Service** | 9099 | http://localhost:9099 | Vendor registration & management |
| **Product Service** | 9100 | http://localhost:9100 | Product catalog |
| **Hotel Service** | 9101 | http://localhost:9101 | Hotel bookings |
| **Property Service** | 9102 | http://localhost:9102 | Real estate properties |
| **Tour Service** | 9103 | http://localhost:9103 | Tours and activities |
| **Order Service** | 9104 | http://localhost:9104 | Order management |
| **Payment Service** | 9105 | http://localhost:9105 | Payment processing |
| **Notification Service** | 9106 | http://localhost:9106 | Email & SMS notifications |

---

## 🚀 How to Start Everything

### **Step 1: Start Backend Services**

```bash
cd /home/psd/Downloads/GlobalHub/backend

# Option A: Start all services at once
./build-and-run-all.sh

# Option B: Start individually in separate terminals
cd globalhub-eureka && mvn spring-boot:run
cd globalhub-gateway && mvn spring-boot:run
cd globalhub-auth-service && mvn spring-boot:run
# ... continue for other services
```

### **Step 2: Start Frontend**

```bash
cd /home/psd/Downloads/GlobalHub

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v6.1.0  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### **Step 3: Access the Application**

Open browser: **http://localhost:5173**

---

## 🔍 Verify Connections

### **Test 1: Check if Frontend Can Reach Backend**

Open browser console (F12) and run:

```javascript
fetch('http://localhost:9096/api/products')
  .then(r => r.json())
  .then(console.log)
```

Should return products array or empty list.

### **Test 2: Check Eureka Dashboard**

Open: http://localhost:9095

You should see all services registered as "UP".

### **Test 3: Direct API Call**

```bash
curl http://localhost:9096/api/products
```

---

## ⚙️ Changing the Backend URL

If you need to change the backend URL (different port or production):

### **Option 1: Update apiClient.js**

**File:** `src/api/apiClient.js`

```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:9096';

// To your desired URL:
const API_BASE_URL = 'http://your-server.com:9096';
```

### **Option 2: Use Environment Variables**

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:9096
```

Then update `apiClient.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9096';
```

### **Option 3: Use Vite Proxy (Recommended for Development)**

Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react(), base44()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9096',
        changeOrigin: true,
      }
    }
  }
});
```

Then in `apiClient.js`, use relative URL:

```javascript
const API_BASE_URL = ''; // Uses same origin
```

---

## 🌍 Production Deployment

### **Frontend Build**

```bash
npm run build
```

Output goes to `dist/` folder.

### **Configure Backend URL**

In production, update the API URL based on your deployment:

**Example 1: Same Domain**
```javascript
const API_BASE_URL = 'https://api.globalhub.com';
```

**Example 2: Different Domain**
```javascript
const API_BASE_URL = 'https://backend.globalhub.com';
```

**Example 3: Behind Load Balancer**
```javascript
const API_BASE_URL = window.location.origin + '/api';
```

---

## 🔧 Troubleshooting

### **Error: "Failed to fetch"**

**Causes:**
1. Backend not running
2. Wrong port number
3. CORS issues

**Solutions:**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:9096/api/products
   ```

2. **Verify correct port:**
   - Gateway should be on port 9096
   - Check `backend/globalhub-gateway/src/main/resources/application.yml`

3. **Enable CORS in Gateway:**
   Already configured in your Gateway service.

### **Error: "CORS policy blocked"**

**Solution:** Add CORS configuration to API Gateway:

Already configured in your `globalhub-gateway` with `@CrossOrigin(origins = "*")`.

### **Frontend Loads But No Data**

**Check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for failed requests
4. Check error messages

**Common Issues:**
- Backend not started
- Wrong API endpoint
- Authentication required

---

## 📊 Request Flow Diagram

```
┌──────────────┐
│   Browser    │ http://localhost:5173
└──────┬───────┘
       │
       │ HTTP Request
       ↓
┌──────────────┐
│   Frontend   │ React App (Vite)
│ (apiClient)  │
└──────┬───────┘
       │
       │ Fetch API Call
       │ http://localhost:9096/api/...
       ↓
┌──────────────┐
│ API Gateway  │ Port 9096
└──────┬───────┘
       │
       │ Routes to appropriate service
       ↓
┌──────────────┐
│   Eureka     │ Discovers service location
│  (Port 9095) │
└──────┬───────┘
       │
       │ Returns service instance
       ↓
┌──────────────┐
│ Target Svc   │ e.g., Product Service (9100)
└──────┬───────┘
       │
       │ Response
       ↓
┌──────────────┐
│   Frontend   │ Updates UI
└──────────────┘
```

---

## ✅ Quick Reference

### **Development URLs**

```
Frontend:        http://localhost:5173
Backend Gateway: http://localhost:9096
Eureka Dashboard:http://localhost:9095
```

### **API Endpoints**

All accessible through Gateway:

```
Authentication:  http://localhost:9096/api/auth/*
Users:          http://localhost:9096/api/users/*
Vendors:        http://localhost:9096/api/vendors/*
Products:       http://localhost:9096/api/products/*
Hotels:         http://localhost:9096/api/hotels/*
Properties:     http://localhost:9096/api/properties/*
Tours:          http://localhost:9096/api/tours/*
Orders:         http://localhost:9096/api/orders/*
Payments:       http://localhost:9096/api/payments/*
Notifications:  http://localhost:9096/api/notifications/*
```

---

## 🎯 Summary

✅ **Frontend runs on:** http://localhost:5173  
✅ **Backend Gateway:** http://localhost:9096  
✅ **All API calls go through Gateway**  
✅ **Gateway uses Eureka for service discovery**  
✅ **Configuration updated in `src/api/apiClient.js`**  

**You're ready to start developing!** 🚀

---

*Last Updated: March 16, 2026*
