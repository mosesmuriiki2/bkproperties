# GlobalHub Backend - Spring Boot Microservices

## 🏗️ Architecture Overview

This backend uses a **microservices architecture** built with Spring Boot 3.2.3 and Java 17, designed to support the GlobalHub multi-service marketplace platform.

### **Technology Stack**
- **Java**: 17
- **Spring Boot**: 3.2.3
- **Spring Cloud**: 2023.0.0 (Microservices patterns)
- **Database**: PostgreSQL / MySQL (per service)
- **Cache**: Redis
- **Message Queue**: RabbitMQ / Kafka
- **API Gateway**: Spring Cloud Gateway
- **Service Discovery**: Eureka
- **Security**: JWT + Spring Security
- **Documentation**: OpenAPI/Swagger

---

## 📦 Microservices Structure

### **Infrastructure Services**

#### 1. **Eureka Server** (`globalhub-eureka`)
- Service discovery and registration
- Port: `8761`
- All microservices register here for dynamic service discovery

#### 2. **API Gateway** (`globalhub-gateway`)
- Central entry point for all client requests
- Route management
- Rate limiting
- Authentication/Authorization filtering
- Port: `8080`

---

### **Business Microservices**

#### 3. **Authentication Service** (`globalhub-auth-service`)
- User authentication and authorization
- JWT token generation/validation
- OAuth2 integration
- Password management
- Port: `8081`

**Key Endpoints:**
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Password reset request
PUT    /api/auth/reset-password    - Reset password
```

#### 4. **User Service** (`globalhub-user-service`)
- Consumer profile management
- User preferences
- Address management
- Order history access
- Port: `8082`

**Key Endpoints:**
```
GET    /api/users/{id}             - Get user profile
PUT    /api/users/{id}             - Update user profile
DELETE /api/users/{id}             - Delete user account
GET    /api/users/{id}/addresses   - Get user addresses
POST   /api/users/{id}/addresses   - Add new address
GET    /api/users/{id}/orders      - Get user orders
```

#### 5. **Vendor Service** (`globalhub-vendor-service`)
- Vendor registration and verification
- Vendor profile management
- Business information
- Performance metrics
- Port: `8083`

**Key Endpoints:**
```
POST   /api/vendors/register       - Register as vendor
GET    /api/vendors                - List all vendors (admin)
GET    /api/vendors/{id}           - Get vendor details
PUT    /api/vendors/{id}           - Update vendor profile
GET    /api/vendors/{id}/products  - Get vendor products
GET    /api/vendors/{id}/analytics - Get vendor analytics
PUT    /api/vendors/{id}/status    - Update vendor status (admin)
```

#### 6. **Product Service** (`globalhub-product-service`)
- Product catalog management
- Categories and attributes
- Inventory management
- Search and filtering
- Port: `8084`

**Key Endpoints:**
```
GET    /api/products               - List products (with filters)
POST   /api/products               - Create product (vendor)
GET    /api/products/{id}          - Get product details
PUT    /api/products/{id}          - Update product (vendor)
DELETE /api/products/{id}          - Delete product (vendor)
GET    /api/products/categories    - Get categories
POST   /api/products/{id}/images   - Upload product images
GET    /api/products/search        - Search products
```

#### 7. **Hotel Service** (`globalhub-hotel-service`)
- Hotel listings
- Room management
- Availability calendar
- Booking management
- Port: `8085`

**Key Endpoints:**
```
GET    /api/hotels                 - List hotels
POST   /api/hotels                 - Create hotel (vendor)
GET    /api/hotels/{id}            - Get hotel details
GET    /api/hotels/{id}/rooms      - Get hotel rooms
POST   /api/hotels/{id}/rooms      - Add room (vendor)
GET    /api/hotels/search          - Search hotels
GET    /api/hotels/{id}/availability - Check availability
POST   /api/hotels/bookings        - Create booking
```

#### 8. **Property Service** (`globalhub-property-service`)
- Real estate listings (properties & land)
- Property features and amenities
- Location data
- Price history
- Port: `8086`

**Key Endpoints:**
```
GET    /api/properties             - List properties
POST   /api/properties             - Create property (vendor)
GET    /api/properties/{id}        - Get property details
GET    /api/properties/land        - List land parcels
GET    /api/properties/search      - Search properties
GET    /api/properties/{id}/location - Get location details
```

#### 9. **Tour Service** (`globalhub-tour-service`)
- Tour packages
- Tourist vehicles
- Itineraries
- Booking management
- Port: `8087`

**Key Endpoints:**
```
GET    /api/tours                  - List tour packages
POST   /api/tours                  - Create tour (vendor)
GET    /api/tours/{id}             - Get tour details
GET    /api/tours/vehicles         - List tourist vehicles
POST   /api/tours/bookings         - Book tour/vehicle
GET    /api/tours/search           - Search tours
```

#### 10. **Order Service** (`globalhub-order-service`)
- Order processing
- Order tracking
- Order history
- Status updates
- Port: `8088`

**Key Endpoints:**
```
POST   /api/orders                 - Create order
GET    /api/orders/{id}            - Get order details
GET    /api/orders/user/{userId}   - Get user orders
PUT    /api/orders/{id}/status     - Update order status
GET    /api/orders/vendor/{vendorId} - Get vendor orders
```

#### 11. **Payment Service** (`globalhub-payment-service`)
- Payment processing
- Stripe integration
- Transaction history
- Refund management
- Port: `8089`

**Key Endpoints:**
```
POST   /api/payments               - Process payment
GET    /api/payments/{id}          - Get payment details
POST   /api/payments/{id}/refund   - Process refund
GET    /api/payments/order/{orderId} - Get order payments
WEBHOOK /api/payments/stripe-webhook - Stripe webhook
```

#### 12. **Notification Service** (`globalhub-notification-service`)
- Email notifications
- SMS notifications
- Push notifications
- Notification templates
- Port: `8090`

**Key Endpoints:**
```
POST   /api/notifications/email    - Send email
POST   /api/notifications/sms      - Send SMS
POST   /api/notifications/push     - Send push notification
GET    /api/notifications/user/{userId} - Get user notifications
```

---

## 🔧 Common Dependencies (Each Microservice)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    
    <!-- OpenAPI Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 🚀 Getting Started

### **Prerequisites**
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 15+
- Redis 7+
- RabbitMQ 3.12+ (optional for async communication)

### **Installation**

1. **Clone and navigate to backend**
```bash
cd backend
```

2. **Build all microservices**
```bash
mvn clean install
```

3. **Configure databases**
Create databases for each service:
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

4. **Update application.properties** for each service with database credentials

5. **Start services in order**

**Step 1: Eureka Server**
```bash
cd globalhub-eureka
mvn spring-boot:run
```

**Step 2: API Gateway**
```bash
cd globalhub-gateway
mvn spring-boot:run
```

**Step 3: Start all business services**
```bash
# In separate terminals
cd globalhub-auth-service && mvn spring-boot:run
cd globalhub-user-service && mvn spring-boot:run
cd globalhub-vendor-service && mvn spring-boot:run
cd globalhub-product-service && mvn spring-boot:run
cd globalhub-hotel-service && mvn spring-boot:run
cd globalhub-property-service && mvn spring-boot:run
cd globalhub-tour-service && mvn spring-boot:run
cd globalhub-order-service && mvn spring-boot:run
cd globalhub-payment-service && mvn spring-boot:run
cd globalhub-notification-service && mvn spring-boot:run
```

---

## 🔌 Frontend Integration

### **Update Frontend API Base URL**

In your React app, update the API client to use the Gateway:

```javascript
// src/api/base44Client.js
const API_BASE_URL = 'http://localhost:8080'; // Points to Gateway

// Example API calls
export const api = {
  // Auth
  login: (credentials) => 
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  // Products
  getProducts: (params) => 
    fetch(`${API_BASE_URL}/api/products${params}`, {
      method: 'GET',
      headers: getAuthHeaders()
    }),
  
  // Hotels
  searchHotels: (criteria) => 
    fetch(`${API_BASE_URL}/api/hotels/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    })
};
```

### **CORS Configuration**

Each microservice includes CORS configuration to allow frontend requests:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 📊 API Gateway Routes

The gateway routes requests to appropriate microservices:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/api/auth/**
        
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**
        
        - id: vendor-service
          uri: lb://VENDOR-SERVICE
          predicates:
            - Path=/api/vendors/**
        
        - id: product-service
          uri: lb://PRODUCT-SERVICE
          predicates:
            - Path=/api/products/**
        
        - id: hotel-service
          uri: lb://HOTEL-SERVICE
          predicates:
            - Path=/api/hotels/**
        
        - id: property-service
          uri: lb://PROPERTY-SERVICE
          predicates:
            - Path=/api/properties/**
        
        - id: tour-service
          uri: lb://TOUR-SERVICE
          predicates:
            - Path=/api/tours/**
        
        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/orders/**
        
        - id: payment-service
          uri: lb://PAYMENT-SERVICE
          predicates:
            - Path=/api/payments/**
```

---

## 🔐 Security Architecture

### **JWT Token Flow**

1. User logs in via Auth Service
2. Auth Service validates credentials and generates JWT
3. JWT stored in frontend (localStorage/cookies)
4. Frontend includes JWT in Authorization header
5. Gateway validates JWT
6. Request forwarded to target service with user context

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

## 📝 Database Schema Examples

### **Users Table**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Vendors Table**
```sql
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    tax_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Products Table**
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT REFERENCES vendors(id),
    category VARCHAR(100),
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    stock_quantity INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### **Run Tests**
```bash
mvn test
```

### **Test Individual Service**
```bash
cd globalhub-auth-service
mvn test
```

---

## 📈 Monitoring & Observability

### **Health Checks**
Each service exposes health endpoints:
```
GET /actuator/health
```

### **Metrics**
```
GET /actuator/metrics
```

### **Swagger Documentation**
Access API documentation for each service:
```
http://localhost:{port}/swagger-ui.html
```

Examples:
- Auth Service: http://localhost:8081/swagger-ui.html
- Product Service: http://localhost:8084/swagger-ui.html
- Hotel Service: http://localhost:8085/swagger-ui.html

---

## 🔄 Inter-Service Communication

### **Synchronous (Feign Clients)**
```java
@FeignClient(name = "vendor-service")
public interface VendorClient {
    @GetMapping("/api/vendors/{id}")
    VendorDTO getVendorById(@PathVariable Long id);
}
```

### **Asynchronous (RabbitMQ/Kafka)**
```java
@RabbitListener(queues = "${rabbitmq.queue.orders}")
public void handleOrderCreated(OrderEvent event) {
    // Send notification
    notificationService.sendOrderConfirmation(event);
}
```

---

## 🎯 Key Features Implementation

### **1. Multi-Sector Support**
- Separate services for different sectors (hotels, properties, tours, products)
- Shared infrastructure (auth, users, orders, payments)

### **2. Vendor Management**
- Registration workflow
- Verification process
- Performance tracking

### **3. E-commerce**
- Shopping cart
- Order processing
- Payment integration (Stripe)

### **4. Booking System**
- Hotel reservations
- Tour bookings
- Vehicle rentals

### **5. Search & Discovery**
- Full-text search
- Filtering and sorting
- Category-based navigation

---

## 🚨 Error Handling

### **Global Exception Handler**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(...) {
        return ResponseEntity.status(404).body(error);
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessError(...) {
        return ResponseEntity.status(400).body(error);
    }
}
```

---

## 📦 Deployment

### **Docker Support**
Each service has Dockerfile:
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### **Docker Compose**
Use docker-compose.yml to orchestrate all services with databases.

---

## 🔧 Configuration Management

### **Application Properties Template**
```properties
# Server
server.port=8081

# Application
spring.application.name=auth-service

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/globalhub_auth
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=3600000

# CORS
app.cors.allowed-origins=http://localhost:5173
```

---

## 📞 Support

For issues or questions:
- Check Swagger documentation
- Review service logs
- Monitor Eureka dashboard: http://localhost:8761

---

*Built with Spring Boot 3.2.3 | Java 17 | Spring Cloud 2023.0.0*
