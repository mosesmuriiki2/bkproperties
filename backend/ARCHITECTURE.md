# GlobalHub - Complete System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GLOBALHUB PLATFORM                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────────────────────────┐
│   React Frontend│         │      Spring Boot Microservices       │
│   (Port 5173)   │◄───────►│         (Java 17 + Spring Cloud)     │
│                 │  HTTP   │                                      │
│  • Components   │  JSON   │  ┌────────────────────────────────┐ │
│  • Pages        │  REST   │  │    API Gateway (Port 8080)    │ │
│  • Hooks        │         │  │  • Request Routing            │ │
│  • Context API  │         │  │  • Authentication Filter      │ │
│                 │         │  │  • Rate Limiting              │ │
└─────────────────┘         │  │  • CORS Management            │ │
                            │  └────────────┬───────────────────┘ │
                            │               │                      │
                            │  ┌────────────▼───────────────────┐ │
                            │  │    Eureka Server (8761)       │ │
                            │  │  • Service Discovery          │ │
                            │  │  • Service Registry           │ │
                            │  └────────────────────────────────┘ │
                            │                                      │
                            │  Business Microservices:             │
                            │  ┌──────────┐ ┌──────────┐          │
                            │  │Auth :8081│ │Users:8082│          │
                            │  └──────────┘ └──────────┘          │
                            │  ┌──────────┐ ┌──────────┐          │
                            │  │Vendors   │ │Products  │          │
                            │  │:8083     │ │:8084     │          │
                            │  └──────────┘ └──────────┘          │
                            │  ┌──────────┐ ┌──────────┐          │
                            │  │Hotels    │ │Properties│          │
                            │  │:8085     │ │:8086     │          │
                            │  └──────────┘ └──────────┘          │
                            │  ┌──────────┐ ┌──────────┐          │
                            │  │Tours     │ │Orders    │          │
                            │  │:8087     │ │:8088     │          │
                            │  └──────────┘ └──────────┘          │
                            │  ┌──────────┐ ┌──────────┐          │
                            │  │Payments  │ │Notifs.   │          │
                            │  │:8089     │ │:8090     │          │
                            │  └──────────┘ └──────────┘          │
                            └──────────────────────────────────────┘
                                         │
                                         │
                            ┌────────────▼────────────┐
                            │    Data Layer           │
                            │                         │
                            │  ┌──────────────────┐  │
                            │  │  PostgreSQL DBs  │  │
                            │  │  (Per Service)   │  │
                            │  └──────────────────┘  │
                            │  ┌──────────────────┐  │
                            │  │  Redis Cache     │  │
                            │  └──────────────────┘  │
                            │  ┌──────────────────┐  │
                            │  │  RabbitMQ/Kafka  │  │
                            │  └──────────────────┘  │
                            └─────────────────────────┘
```

---

## 📊 Detailed Service Architecture

### **1. Frontend Layer (React)**

```
src/
├── api/
│   ├── base44Client.js       # Legacy Base44 client
│   └── apiClient.js          # NEW: Spring Boot API client
├── components/
│   ├── admin/                # Admin dashboard components
│   ├── cars/                 # Automotive components
│   └── ui/                   # Reusable UI components (Radix)
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Cars.jsx              # Car marketplace
│   ├── Hotels.jsx            # Hotel booking
│   ├── Properties.jsx        # Real estate
│   ├── Tours.jsx             # Tour packages
│   ├── VendorDashboard.jsx   # Vendor portal
│   └── ...
├── lib/
│   ├── AuthContext.jsx       # Authentication context
│   └── utils.js              # Helper functions
└── Layout.jsx                # Main layout wrapper
```

**Key Features:**
- Component-based architecture
- React Router for navigation
- Context API for state management
- Radix UI components
- Tailwind CSS styling
- Hot Module Replacement (HMR)

---

### **2. API Gateway Layer**

**Technology**: Spring Cloud Gateway

**Responsibilities:**
- Route requests to appropriate microservices
- JWT token validation
- Rate limiting
- CORS handling
- Load balancing

**Configuration:**
```yaml
routes:
  - id: auth-service
    uri: lb://AUTH-SERVICE
    predicates:
      - Path=/api/auth/**
  
  - id: product-service
    uri: lb://PRODUCT-SERVICE
    predicates:
      - Path=/api/products/**
```

---

### **3. Authentication Service**

**Port**: 8081

**Technologies:**
- Spring Security
- JWT (JSON Web Tokens)
- BCrypt password hashing

**Entities:**
```java
User {
  id: Long
  email: String
  passwordHash: String
  firstName: String
  lastName: String
  role: UserRole (CONSUMER/VENDOR/ADMIN)
  isVerified: boolean
}
```

**Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

---

### **4. User Service**

**Port**: 8082

**Responsibilities:**
- User profile management
- Address management
- Order history
- Preferences

**Database**: `globalhub_users`

---

### **5. Vendor Service**

**Port**: 8083

**Responsibilities:**
- Vendor registration
- Business verification
- Vendor profiles
- Performance metrics

**Entities:**
```java
Vendor {
  id: Long
  userId: Long (FK)
  businessName: String
  businessType: String
  taxNumber: String
  status: VENDOR_STATUS
  rating: Double
}
```

---

### **6. Product Service**

**Port**: 8084

**Responsibilities:**
- Product catalog
- Categories & attributes
- Inventory management
- Search functionality

**Features:**
- Full-text search
- Category filtering
- Price range queries
- Image gallery support

---

### **7. Hotel Service**

**Port**: 8085

**Responsibilities:**
- Hotel listings
- Room management
- Availability calendar
- Booking system

**Entities:**
```java
Hotel {
  id: Long
  vendorId: Long
  name: String
  location: String
  starRating: Integer
  amenities: List<String>
}

Room {
  id: Long
  hotelId: Long
  type: String
  price: BigDecimal
  capacity: Integer
}

Booking {
  id: Long
  roomId: Long
  userId: Long
  checkIn: LocalDate
  checkOut: LocalDate
  status: BOOKING_STATUS
}
```

---

### **8. Property Service**

**Port**: 8086

**Responsibilities:**
- Property listings (houses, apartments)
- Land parcels
- Location data
- Price history

**Features:**
- Geo-spatial queries
- Property features
- Image galleries
- Virtual tour links

---

### **9. Tour Service**

**Port**: 8087

**Responsibilities:**
- Tour packages
- Tourist vehicles
- Itineraries
- Guide assignments

**Entities:**
```java
TourPackage {
  id: Long
  name: String
  destination: String
  duration: Integer (days)
  price: BigDecimal
  itinerary: String
}

TouristVehicle {
  id: Long
  type: String
  capacity: Integer
  pricePerDay: BigDecimal
  available: boolean
}
```

---

### **10. Order Service**

**Port**: 8088

**Responsibilities:**
- Order creation
- Order tracking
- Status updates
- Order history

**Order Flow:**
```
1. User adds items to cart
2. Checkout → Create Order
3. Payment processing
4. Order confirmation
5. Fulfillment
6. Delivery
```

---

### **11. Payment Service**

**Port**: 8089

**Technologies:**
- Stripe SDK
- PCI Compliance

**Responsibilities:**
- Payment processing
- Refund management
- Transaction history
- Invoice generation

**Payment Methods:**
- Credit/Debit Cards
- Digital Wallets
- Bank Transfers

---

### **12. Notification Service**

**Port**: 8090

**Technologies:**
- RabbitMQ/Kafka
- SMTP (Email)
- Twilio (SMS)
- Firebase (Push)

**Responsibilities:**
- Email notifications
- SMS alerts
- Push notifications
- Template management

---

## 🔄 Inter-Service Communication

### **Synchronous (REST)**

```java
@FeignClient(name = "vendor-service")
public interface VendorClient {
    @GetMapping("/api/vendors/{id}")
    VendorDTO getVendorById(@PathVariable Long id);
}
```

### **Asynchronous (Message Queue)**

```java
// Publisher (Order Service)
rabbitTemplate.convertAndExchange(
    "orders.exchange",
    "order.created",
    orderEvent
);

// Consumer (Notification Service)
@RabbitListener(queues = "${rabbitmq.queue.notifications}")
public void handleOrderCreated(OrderEvent event) {
    sendConfirmationEmail(event.getUserEmail());
}
```

---

## 🗄️ Database Architecture

### **Database-per-Service Pattern**

```
globalhub_auth       → Auth Service
globalhub_users      → User Service
globalhub_vendors    → Vendor Service
globalhub_products   → Product Service
globalhub_hotels     → Hotel Service
globalhub_properties → Property Service
globalhub_tours      → Tour Service
globalhub_orders     → Order Service
globalhub_payments   → Payment Service
```

**Benefits:**
- Loose coupling
- Independent scaling
- Technology diversity
- Fault isolation

---

## 🔐 Security Architecture

### **JWT Token Flow**

```
1. User Login
   ↓
2. Auth Service validates credentials
   ↓
3. Generate JWT (Access + Refresh tokens)
   ↓
4. Return tokens to client
   ↓
5. Client stores in localStorage
   ↓
6. Include token in Authorization header
   ↓
7. Gateway validates token
   ↓
8. Forward to target service with user context
```

### **Token Structure**

```json
{
  "userId": "12345",
  "email": "user@example.com",
  "role": "CONSUMER",
  "iat": 1709999999,
  "exp": 1710003599
}
```

---

## 📈 Scalability Considerations

### **Horizontal Scaling**

- Multiple instances of each service
- Load balancing via Gateway
- Service discovery via Eureka

### **Caching Strategy**

```
┌─────────────┐
│   Redis     │  ← Shared cache layer
└──────┬──────┘
       │
┌──────▼──────────────┐
│ Microservices       │
│ • Product listings  │
│ • User sessions     │
│ • Token blacklist   │
└─────────────────────┘
```

### **Database Scaling**

- Read replicas for read-heavy services
- Sharding for large datasets
- Connection pooling (HikariCP)

---

## 🎯 Frontend-Backend Integration Points

### **1. Authentication**

```javascript
// Frontend: src/api/apiClient.js
const login = async (credentials) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
};
```

### **2. Product Listing**

```javascript
// Fetch products
const products = await api.products.getAll({
  category: 'cars',
  minPrice: 10000,
  maxPrice: 50000
});
```

### **3. Hotel Booking**

```javascript
// Search hotels
const hotels = await api.hotels.search({
  location: 'Paris',
  checkIn: '2024-04-01',
  checkOut: '2024-04-05',
  guests: 2
});

// Create booking
const booking = await api.hotels.book({
  hotelId: 123,
  roomId: 456,
  checkIn: '2024-04-01',
  checkOut: '2024-04-05'
});
```

---

## 🚀 Deployment Architecture

### **Development**

```
Local Machine
├── React Dev Server (Port 5173)
├── Eureka Server (8761)
├── API Gateway (8080)
└── Microservices (8081-8090)
```

### **Production**

```
Cloud Environment (AWS/Azure/GCP)
├── Load Balancer
│   ├── React App (CDN/S3)
│   └── API Gateway (Multiple instances)
│       ├── Microservices (Kubernetes pods)
│       ├── Databases (RDS/Azure SQL)
│       ├── Redis Cluster (ElastiCache)
│       └── Message Queue (SQS/RabbitMQ)
```

---

## 📊 Monitoring & Observability

### **Health Checks**

```
GET /actuator/health
```

### **Metrics**

```
GET /actuator/metrics
- JVM memory
- HTTP request counts
- Database connections
- Cache hit rates
```

### **Distributed Tracing**

- Spring Cloud Sleuth
- Zipkin/Jaeger integration
- Request correlation IDs

---

## 🎨 Technology Stack Summary

### **Frontend**
- React 18.2
- Vite 6.1
- Tailwind CSS 3.4
- Radix UI Components
- React Router 6.26
- TanStack Query 5.84

### **Backend**
- Java 17
- Spring Boot 3.2.3
- Spring Cloud 2023.0.0
- PostgreSQL 15
- Redis 7
- RabbitMQ 3.12
- Stripe API

### **DevOps**
- Docker
- Docker Compose
- Kubernetes (production)
- CI/CD pipelines

---

## 📝 Next Steps

1. ✅ Backend infrastructure created
2. ✅ API endpoints defined
3. ⏳ Implement remaining services (User, Vendor, etc.)
4. ⏳ Update frontend to use new API client
5. ⏳ Test integration points
6. ⏳ Deploy to staging environment

---

*Complete System Architecture | GlobalHub 2026*
