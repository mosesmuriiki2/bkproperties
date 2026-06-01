# Frontend-Backend Integration Guide

## 📋 Overview

This guide explains how to integrate the React frontend with the Spring Boot microservices backend.

---

## 🔧 Setup Instructions

### **1. Backend Setup**

#### Prerequisites
- Java 17
- Maven 3.8+
- PostgreSQL 15+

#### Quick Start

```bash
cd backend

# Make scripts executable
chmod +x setup.sh start-all.sh stop-all.sh

# Run setup (creates databases and builds)
./setup.sh

# Start all services
./start-all.sh
```

#### Manual Setup

1. **Create Databases**
```sql
CREATE DATABASE globalhub_auth;
CREATE DATABASE globalhub_users;
CREATE DATABASE globalhub_vendors;
CREATE DATABASE globalhub_products;
CREATE DATABASE globalhub_hotels;
CREATE DATABASE globalhub_properties;
CREATE DATABASE globalhub_tours;
CREATE DATABASE globalhub_orders;
CREATE DATABASE globalhub_payments;
```

2. **Update Database Credentials**
Edit `src/main/resources/application.yml` in each service:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/globalhub_{service}
    username: postgres
    password: your_password
```

3. **Start Services in Order**

Terminal 1 - Eureka Server:
```bash
cd backend/globalhub-eureka
mvn spring-boot:run
```

Terminal 2 - API Gateway:
```bash
cd backend/globalhub-gateway
mvn spring-boot:run
```

Terminal 3+ - Business Services:
```bash
cd backend/globalhub-auth-service
mvn spring-boot:run
# Repeat for other services
```

---

### **2. Frontend Configuration**

The frontend is already configured to use the backend API through the API Gateway.

**API Client Location**: `src/api/apiClient.js`

**Base URL**: `http://localhost:8080`

---

## 🌐 Architecture

```
┌─────────────┐
│   Browser   │
│  (React App)│
└──────┬──────┘
       │
       │ HTTP Requests
       ▼
┌─────────────────┐
│  API Gateway    │ Port: 8080
│  (Spring Cloud  │
│     Gateway)    │
└────────┬────────┘
         │
         │ Routes to appropriate service
         ▼
┌────────────────────────────────────────┐
│         Microservices                  │
│  ┌──────────┐  ┌──────────┐           │
│  │   Auth   │  │  Users   │           │
│  │ :8081    │  │ :8082    │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │ Vendors  │  │ Products │           │
│  │ :8083    │  │ :8084    │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │  Hotels  │  │Properties│           │
│  │ :8085    │  │ :8086    │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │  Tours   │  │  Orders  │           │
│  │ :8087    │  │ :8088    │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐                         │
│  │ Payments │                         │
│  │ :8089    │                         │
│  └──────────┘                         │
└────────────────────────────────────────┘
         ▲
         │
┌────────┴────────┐
│  Eureka Server  │ Port: 8761
│ (Service Disc.) │
└─────────────────┘
```

---

## 🔑 Authentication Flow

### **Login Process**

```javascript
import api from './api/apiClient';

// Login
const login = async (email, password) => {
  try {
    const response = await api.auth.login({
      email,
      password
    });
    
    // Token is automatically stored in localStorage
    console.log('Logged in as:', response.email);
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### **Making Authenticated Requests**

```javascript
// Get user profile
const getUserProfile = async (userId) => {
  try {
    const user = await api.users.getProfile(userId);
    console.log('User profile:', user);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

// Get products
const getProducts = async () => {
  try {
    const products = await api.products.getAll();
    console.log('Products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};
```

---

## 📦 Example Integrations

### **1. User Registration Component**

```jsx
import React, { useState } from 'react';
import api from '../api/apiClient';

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.auth.register(formData);
      alert('Registration successful! Please login.');
      // Navigate to login page
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### **2. Product Listing Component**

```jsx
import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### **3. Hotel Search Component**

```jsx
import React, { useState } from 'react';
import api from '../api/apiClient';

function HotelSearch() {
  const [criteria, setCriteria] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  
  const [hotels, setHotels] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      const results = await api.hotels.search(criteria);
      setHotels(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        {/* Search inputs */}
      </form>
      
      <div className="hotel-results">
        {hotels.map(hotel => (
          <div key={hotel.id}>
            <h3>{hotel.name}</h3>
            <p>{hotel.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **4. Shopping Cart & Checkout**

```jsx
import React, { useState } from 'react';
import api from '../api/apiClient';

function Checkout({ cartItems }) {
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    
    try {
      // Create order
      const order = await api.orders.create({
        items: cartItems,
        total: calculateTotal(cartItems)
      });

      // Process payment
      const payment = await api.payments.process({
        orderId: order.id,
        amount: order.total,
        paymentMethod: 'CARD'
      });

      alert('Order placed successfully!');
      
      // Clear cart and redirect
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={processing}>
      {processing ? 'Processing...' : 'Checkout'}
    </button>
  );
}
```

---

## 🗺️ API Endpoints Reference

### **Authentication** (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| POST | `/refresh` | Refresh JWT token |

### **Users** (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{id}` | Get user profile |
| PUT | `/{id}` | Update profile |
| GET | `/{id}/addresses` | Get addresses |
| POST | `/{id}/addresses` | Add address |
| GET | `/{id}/orders` | Get order history |

### **Vendors** (`/api/vendors`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register as vendor |
| GET | `/` | List all vendors |
| GET | `/{id}` | Get vendor details |
| GET | `/{id}/products` | Get vendor products |
| GET | `/{id}/analytics` | Vendor analytics |

### **Products** (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products |
| POST | `/` | Create product |
| GET | `/{id}` | Get product details |
| PUT | `/{id}` | Update product |
| DELETE | `/{id}` | Delete product |
| GET | `/search?q=` | Search products |
| GET | `/categories` | Get categories |

### **Hotels** (`/api/hotels`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List hotels |
| POST | `/search` | Search hotels |
| GET | `/{id}` | Get hotel details |
| GET | `/{id}/rooms` | Get rooms |
| GET | `/{id}/availability` | Check availability |
| POST | `/bookings` | Create booking |

### **Properties** (`/api/properties`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List properties |
| GET | `/land` | List land parcels |
| POST | `/search` | Search properties |
| GET | `/{id}` | Get property details |

### **Tours** (`/api/tours`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List tour packages |
| GET | `/vehicles` | List vehicles |
| POST | `/search` | Search tours |
| POST | `/bookings` | Book tour/vehicle |

### **Orders** (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create order |
| GET | `/{id}` | Get order details |
| GET | `/user/{userId}` | Get user orders |
| PUT | `/{id}/status` | Update status |

### **Payments** (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Process payment |
| GET | `/{id}` | Get payment details |
| GET | `/order/{orderId}` | Get order payments |
| POST | `/{id}/refund` | Process refund |

---

## 🔍 Service Discovery

All services register with Eureka Server.

**Eureka Dashboard**: http://localhost:8761

View registered services and their status.

---

## 📝 Swagger Documentation

Each service provides interactive API documentation:

- **Auth Service**: http://localhost:8081/swagger-ui.html
- **Product Service**: http://localhost:8084/swagger-ui.html
- **Hotel Service**: http://localhost:8085/swagger-ui.html
- etc.

---

## 🛠️ Troubleshooting

### **CORS Errors**

If you see CORS errors, ensure:
1. All services have CORS enabled in `application.yml`
2. Frontend is running on allowed origin (default: `http://localhost:5173`)

### **401 Unauthorized**

- Check if JWT token is present in localStorage
- Token may have expired - refresh or re-login
- Verify token format: `Bearer <token>`

### **Service Unavailable**

- Check if service is registered in Eureka
- Verify service is running on correct port
- Check service logs for errors

### **Database Connection Errors**

- Verify PostgreSQL is running
- Check database credentials in `application.yml`
- Ensure database exists

---

## 🚀 Production Deployment

### **Environment Variables**

Set these in production:

```bash
# API Gateway URL
REACT_APP_API_URL=https://api.globalhub.com

# Enable HTTPS
REACT_APP_SECURE=true
```

### **Build Frontend**

```bash
npm run build
```

Deploy the `dist` folder to your web server.

### **Configure Backend**

Update `application.yml` files with production settings:
- Database URLs
- JWT secrets
- CORS origins
- Stripe API keys

---

## 📞 Support

For issues:
1. Check service logs: `backend/logs/*.log`
2. Review Swagger documentation
3. Check Eureka dashboard
4. Verify database connectivity

---

*GlobalHub Development Team | 2026*
