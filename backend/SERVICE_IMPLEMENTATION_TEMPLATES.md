# GlobalHub - Service Implementation Templates

This document provides templates and patterns for implementing the remaining 9 microservices.

---

## 📋 Service Implementation Checklist

Use this checklist for each service:

### 1. Project Setup
- [ ] Create service directory: `globalhub-{service}-service`
- [ ] Create `pom.xml` with dependencies
- [ ] Create `src/main/java/com/globalhub/{service}/` structure
- [ ] Create `src/main/resources/application.yml`
- [ ] Create main Application class
- [ ] Add to parent `pom.xml` modules

### 2. Configuration
- [ ] Set correct port in `application.yml`
- [ ] Configure database connection
- [ ] Set service name for Eureka registration
- [ ] Configure CORS for frontend
- [ ] Enable Swagger/OpenAPI documentation

### 3. Database Layer
- [ ] Create JPA entities
- [ ] Create repository interfaces
- [ ] Create DTOs for request/response
- [ ] Add validation annotations

### 4. Business Logic
- [ ] Create service layer
- [ ] Implement business logic
- [ ] Add error handling
- [ ] Add logging

### 5. API Layer
- [ ] Create REST controllers
- [ ] Add @RestController and @RequestMapping
- [ ] Implement CRUD endpoints
- [ ] Add Swagger annotations
- [ ] Add exception handling

### 6. Security
- [ ] Add JWT validation filter
- [ ] Implement role-based access control
- [ ] Add CORS configuration
- [ ] Secure sensitive endpoints

### 7. Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test with Swagger UI
- [ ] Test with cURL/Postman

### 8. Documentation
- [ ] Add Swagger annotations
- [ ] Document API endpoints
- [ ] Update INTEGRATION_GUIDE.md
- [ ] Add README for service

---

## 🔧 pom.xml Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.globalhub</groupId>
        <artifactId>globalhub-backend</artifactId>
        <version>1.0.0</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>globalhub-{service}-service</artifactId>
    <name>{Service} Service</name>
    <description>GlobalHub {Service} Microservice</description>

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
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
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

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>

        <!-- OpenAPI/Swagger -->
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

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 📝 application.yml Template

```yaml
server:
  port: 8082  # Change per service

spring:
  application:
    name: {service}-service  # e.g., user-service
  
  datasource:
    url: jdbc:mysql://localhost:3306/globalhub_{service}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: Password@224
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

app:
  jwt:
    secret: your-secret-key-change-in-production-min-32-chars
    expiration: 86400000
  
  cors:
    allowed-origins: http://localhost:5173,http://localhost:3000

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
```

---

## 🏗️ Application Class Template

```java
package com.globalhub.{service};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class {Service}ServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run({Service}ServiceApplication.class, args);
    }
}
```

---

## 🗄️ Entity Template

```java
package com.globalhub.{service}.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "{table_name}")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity} {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

## 📦 Repository Template

```java
package com.globalhub.{service}.repository;

import com.globalhub.{service}.entity.{Entity};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface {Entity}Repository extends JpaRepository<{Entity}, Long> {
    Optional<{Entity}> findByName(String name);
    boolean existsByName(String name);
}
```

---

## 🔧 Service Layer Template

```java
package com.globalhub.{service}.service;

import com.globalhub.{service}.entity.{Entity};
import com.globalhub.{service}.repository.{Entity}Repository;
import com.globalhub.{service}.dto.{Entity}DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class {Entity}Service {
    
    private final {Entity}Repository repository;
    
    public {Entity}DTO create({Entity}DTO dto) {
        log.info("Creating new {entity}");
        {Entity} entity = {Entity}.builder()
            .name(dto.getName())
            .build();
        
        {Entity} saved = repository.save(entity);
        return mapToDTO(saved);
    }
    
    public {Entity}DTO getById(Long id) {
        log.info("Fetching {entity} with id: {}", id);
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("{Entity} not found"));
        return mapToDTO(entity);
    }
    
    public List<{Entity}DTO> getAll() {
        log.info("Fetching all {entities}");
        return repository.findAll()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public {Entity}DTO update(Long id, {Entity}DTO dto) {
        log.info("Updating {entity} with id: {}", id);
        {Entity} entity = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("{Entity} not found"));
        
        entity.setName(dto.getName());
        {Entity} updated = repository.save(entity);
        return mapToDTO(updated);
    }
    
    public void delete(Long id) {
        log.info("Deleting {entity} with id: {}", id);
        repository.deleteById(id);
    }
    
    private {Entity}DTO mapToDTO({Entity} entity) {
        return {Entity}DTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }
}
```

---

## 🌐 Controller Template

```java
package com.globalhub.{service}.controller;

import com.globalhub.{service}.dto.{Entity}DTO;
import com.globalhub.{service}.service.{Entity}Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/{entities}")
@RequiredArgsConstructor
@Tag(name = "{Entity} Management", description = "APIs for managing {entities}")
public class {Entity}Controller {
    
    private final {Entity}Service service;
    
    @PostMapping
    @Operation(summary = "Create new {entity}")
    public ResponseEntity<{Entity}DTO> create(@RequestBody {Entity}DTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.create(dto));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get {entity} by ID")
    public ResponseEntity<{Entity}DTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    @GetMapping
    @Operation(summary = "Get all {entities}")
    public ResponseEntity<List<{Entity}DTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update {entity}")
    public ResponseEntity<{Entity}DTO> update(
        @PathVariable Long id,
        @RequestBody {Entity}DTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete {entity}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 📤 DTO Template

```java
package com.globalhub.{service}.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class {Entity}DTO {
    private Long id;
    private String name;
}
```

---

## 🔐 CORS Configuration Template

```java
package com.globalhub.{service}.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## 🔒 JWT Filter Template

```java
package com.globalhub.{service}.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                var claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
                
                String userId = claims.getSubject();
                var auth = new UsernamePasswordAuthenticationToken(
                    userId, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                logger.error("JWT validation failed: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## 🧪 Unit Test Template

```java
package com.globalhub.{service}.service;

import com.globalhub.{service}.dto.{Entity}DTO;
import com.globalhub.{service}.entity.{Entity};
import com.globalhub.{service}.repository.{Entity}Repository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class {Entity}ServiceTest {
    
    @Mock
    private {Entity}Repository repository;
    
    @InjectMocks
    private {Entity}Service service;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testCreate() {
        {Entity}DTO dto = {Entity}DTO.builder()
            .name("Test")
            .build();
        
        {Entity} entity = {Entity}.builder()
            .id(1L)
            .name("Test")
            .build();
        
        when(repository.save(any())).thenReturn(entity);
        
        {Entity}DTO result = service.create(dto);
        
        assertNotNull(result);
        assertEquals("Test", result.getName());
        verify(repository, times(1)).save(any());
    }
    
    @Test
    void testGetById() {
        {Entity} entity = {Entity}.builder()
            .id(1L)
            .name("Test")
            .build();
        
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        
        {Entity}DTO result = service.getById(1L);
        
        assertNotNull(result);
        assertEquals("Test", result.getName());
    }
}
```

---

## 📋 Service-Specific Implementation Guides

### User Service (Port 8082)
- **Database**: `globalhub_users`
- **Key Entities**: UserProfile, Address
- **Key Endpoints**: GET/PUT /api/users/{id}, GET /api/users/{id}/addresses
- **Priority**: HIGH

### Vendor Service (Port 8083)
- **Database**: `globalhub_vendors`
- **Key Entities**: Vendor, VendorDocument
- **Key Endpoints**: POST /api/vendors/register, GET /api/vendors/{id}
- **Priority**: HIGH

### Product Service (Port 8084)
- **Database**: `globalhub_products`
- **Key Entities**: Product, Category, ProductImage
- **Key Endpoints**: GET/POST /api/products, GET /api/products/search
- **Priority**: HIGH

### Hotel Service (Port 8085)
- **Database**: `globalhub_hotels`
- **Key Entities**: Hotel, Room, HotelBooking
- **Key Endpoints**: GET /api/hotels, POST /api/hotels/search, POST /api/hotels/bookings
- **Priority**: MEDIUM

### Property Service (Port 8086)
- **Database**: `globalhub_properties`
- **Key Entities**: Property, PropertyImage
- **Key Endpoints**: GET /api/properties, POST /api/properties/search
- **Priority**: MEDIUM

### Tour Service (Port 8087)
- **Database**: `globalhub_tours`
- **Key Entities**: TourPackage, TouristVehicle, TourBooking
- **Key Endpoints**: GET /api/tours, POST /api/tours/bookings
- **Priority**: MEDIUM

### Order Service (Port 8088)
- **Database**: `globalhub_orders`
- **Key Entities**: Order, OrderTracking
- **Key Endpoints**: POST /api/orders, GET /api/orders/{id}
- **Priority**: MEDIUM

### Payment Service (Port 8089)
- **Database**: `globalhub_payments`
- **Key Entities**: Payment, Refund
- **Key Endpoints**: POST /api/payments, POST /api/payments/{id}/refund
- **Priority**: MEDIUM

### Notification Service (Port 8090)
- **Database**: `globalhub_notifications`
- **Key Entities**: Notification, NotificationTemplate
- **Key Endpoints**: POST /api/notifications/email, POST /api/notifications/sms
- **Priority**: LOW

---

## 🚀 Quick Start Commands

```bash
# Build all services
mvn clean install

# Start Eureka
cd backend/globalhub-eureka && mvn spring-boot:run

# Start Gateway
cd backend/globalhub-gateway && mvn spring-boot:run

# Start Auth Service
cd backend/globalhub-auth-service && mvn spring-boot:run

# Start new service (template)
cd backend/globalhub-{service}-service && mvn spring-boot:run
```

---

*Use these templates to implement the remaining 9 services efficiently.*
