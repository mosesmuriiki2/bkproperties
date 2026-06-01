# 🎯 Eureka Service Discovery - Complete Setup Guide

## ✅ Eureka Server Configuration Complete

The Eureka Server has been configured to discover and register all microservices.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────┐
│   Eureka Server        │ Port:9095
│ (Service Registry)      │ http://localhost:9095
└───────────┬─────────────┘
            │
            │ All services register here
            ▼
┌─────────────────────────────────────┐
│     Registered Microservices       │
│                                     │
│  • Auth Service       (9097)        │
│  • User Service       (9098)        │
│  • Vendor Service     (9099)        │
│  • Product Service    (9100)        │
│  • Hotel Service      (9101)        │
│  • Property Service   (9102)        │
│  • Tour Service       (9103)        │
│  • Order Service      (9104)        │
│  • Payment Service    (9105)        │
│  • Notification Svc   (9106)        │
└─────────────────────────────────────┘
```

---

## ⚙️ Eureka Server Configuration

### **File:** `globalhub-eureka/src/main/resources/application.yml`

```yaml
server:
 port:9095

spring:
  application:
  name: eureka-server

eureka:
 client:
 register-with-eureka: false    # Server doesn't register itself
  fetch-registry: false           # Server doesn't need to fetch registry
 service-url:
     defaultZone: http://localhost:${server.port}/eureka/
 server:
 enable-self-preservation: true  # Prevents removing instances during network issues
 renewal-percent-threshold: 0.85 # 85% threshold for self-preservation
  wait-time-in-ms-when-sync-empty: 0
 response-cache-auto-expiration-in-seconds: 5

logging:
 level:
  com.netflix.eureka: DEBUG
  com.netflix.discovery: DEBUG
  org.springframework.cloud.netflix.eureka: DEBUG
```

**Key Features:**
- ✅ Self-preservation mode enabled
- ✅ Fast cache expiration (5 seconds)
- ✅ DEBUG logging for troubleshooting
- ✅ Doesn't register itself (it's the registry)

---

## 🔧 Client Services Configuration

Each microservice is configured with:

```yaml
eureka:
 client:
 service-url:
     defaultZone: http://localhost:9095/eureka/
 instance:
  prefer-ip-address: true              # Use IP instead of hostname
  lease-renewal-interval-in-seconds: 10 # Send heartbeat every 10s
  lease-expiration-duration-in-seconds:30 # Expire if no heartbeat for 30s
  health-check-url-path: /actuator/health # Health check endpoint

management:
 endpoints:
  web:
  exposure:
     include: health,info             # Expose health and info endpoints
 endpoint:
  health:
     show-details: always              # Show detailed health info
```

**Heartbeat Mechanism:**
- Every 10 seconds: Service sends heartbeat to Eureka
- After 30 seconds: If no heartbeat, service marked as DOWN
- Self-preservation: During network issues, doesn't remove all instances

---

## 📋 Service Registration Details

| Service | App Name | Port| Database | Registration Status |
|---------|----------|------|----------|---------------------|
| **Eureka Server** | eureka-server | 9095 | N/A | ✅ Always UP |
| **API Gateway** | api-gateway | 9096 | globalhub_gateway | ⏳ Registers on start |
| **Auth Service** | auth-service | 9097 | globalhub_auth | ⏳ Registers on start|
| **User Service** | user-service | 9098 | globalhub_users | ⏳ Registers on start|
| **Vendor Service** | vendor-service | 9099 | globalhub_vendors | ⏳ Registers on start|
| **Product Service** | product-service | 9100 | globalhub_products | ⏳ Registers on start |
| **Hotel Service** | hotel-service | 9101 | globalhub_hotels | ⏳ Registers on start|
| **Property Service** | property-service | 9102 | globalhub_properties | ⏳ Registers on start |
| **Tour Service** | tour-service | 9103 | globalhub_tours | ⏳ Registers on start |
| **Order Service** | order-service | 9104 | globalhub_orders | ⏳ Registers on start |
| **Payment Service** | payment-service | 9105 | globalhub_payments | ⏳ Registers on start|
| **Notification Service** | notification-service | 9106 | globalhub_notifications | ⏳ Registers on start|

---

## 🚀 How to Start Services

### **Step 1: Start Eureka Server First**

```bash
cd /home/psd/Downloads/GlobalHub/backend

# Terminal 1
cd globalhub-eureka
mvn spring-boot:run
```

Wait for this message:
```
Started EurekaServerApplication in X.XXX seconds
```

### **Step 2: Start API Gateway**

```bash
# Terminal 2
cd globalhub-gateway
mvn spring-boot:run
```

### **Step 3: Start Business Services**

```bash
# Terminal 3
cd globalhub-auth-service
mvn spring-boot:run

# Terminal 4
cd globalhub-user-service
mvn spring-boot:run

# Terminal 5
cd globalhub-vendor-service
mvn spring-boot:run

# Terminal 6
cd globalhub-product-service
mvn spring-boot:run

# Continue for remaining services...
```

### **Alternative: Start All at Once**

```bash
cd /home/psd/Downloads/GlobalHub/backend
./build-and-run-all.sh
```

This script starts all services automatically in the correct order.

---

## 🔍 Verifying Service Registration

### **1. Eureka Dashboard**

Open browser: **http://localhost:9095**

You should see:
```
DS Replicas    Instances
AUTH-SERVICE   1 (auth-service:9097)
USER-SERVICE  1 (user-service:9098)
VENDOR-SERVICE 1 (vendor-service:9099)
PRODUCT-SERVICE 1 (product-service:9100)
HOTEL-SERVICE  1 (hotel-service:9101)
PROPERTY-SERVICE 1 (property-service:9102)
TOUR-SERVICE   1 (tour-service:9103)
ORDER-SERVICE  1 (order-service:9104)
PAYMENT-SERVICE 1 (payment-service:9105)
NOTIFICATION-SERVICE 1 (notification-service:9106)
API-GATEWAY    1 (api-gateway:9096)
```

### **2. Via API**

```bash
curl http://localhost:9095/eureka/apps
```

Returns XML with all registered applications.

### **3. Check Individual Service Status**

```bash
# Check if service is UP
curl http://localhost:9097/actuator/health

# Should return:
{"status":"UP"}
```

---

## 🧪 Testing Service Discovery

### **Test 1: Call Service Through Gateway**

```bash
# This request goes through Gateway → Eureka → Product Service
curl http://localhost:9096/api/products
```

**Flow:**
1. Request hits Gateway at port 9096
2. Gateway queries Eureka for "PRODUCT-SERVICE"
3. Eureka returns: product-service:9100
4. Gateway forwards request to port 9100
5. Product Service responds

### **Test 2: Direct Service Call**

```bash
# Bypass Gateway, call directly
curl http://localhost:9100/api/products
```

### **Test 3: Register New Instance**

Start another instance of Product Service on different port:

```bash
# In new terminal
cd globalhub-product-service
mvn spring-boot:run \
  -Dserver.port=9200 \
  -Deureka.instance.instance-id=product-service-2
```

Check Eureka dashboard - you should see 2 instances of PRODUCT-SERVICE!

---

## 🔧 Troubleshooting

### **Service Not Registering**

**Symptoms:**
- Service starts but doesn't appear in Eureka
- Dashboard shows "0" instances

**Solutions:**

1. **Check Eureka URL in application.yml:**
   ```yaml
   eureka:
    client:
   service-url:
        defaultZone: http://localhost:9095/eureka/
   ```

2. **Verify Eureka is running first:**
   ```bash
   curl http://localhost:9095
   ```

3. **Check service logs:**
   ```bash
  tail -f logs/globalhub-product-service.log | grep -i eureka
   ```

4. **Enable DEBUG logging:**
   Add to application.yml:
   ```yaml
  logging:
    level:
    com.netflix.discovery: DEBUG
   ```

### **Service Shows as DOWN**

**Causes:**
- Heartbeat not reaching Eureka
- Network issues
- Service overloaded

**Solutions:**

1. **Increase heartbeat interval:**
   ```yaml
   eureka:
   instance:
     lease-renewal-interval-in-seconds: 30
   ```

2. **Increase expiration time:**
   ```yaml
   eureka:
   instance:
     lease-expiration-duration-in-seconds: 90
   ```

3. **Check network/firewall**

### **Multiple Instances Conflicts**

If running multiple instances:

```yaml
eureka:
 instance:
  instance-id: ${spring.application.name}:${random.uuid}
  prefer-ip-address: true
```

---

## 📊 Monitoring Service Health

### **Health Endpoints**

Each service exposes:

```bash
# Basic health check
curl http://localhost:9100/actuator/health

# Detailed health
curl http://localhost:9100/actuator/health?showDetails=always

# Service info
curl http://localhost:9100/actuator/info
```

### **Eureka Metrics**

```bash
# Eureka server metrics
curl http://localhost:9095/actuator/metrics

# Registered services count
curl http://localhost:9095/eureka/apps | grep -c "<application>"
```

---

## 🎯 Best Practices

### **1. Start Order**
Always start Eureka Server first, then Gateway, then business services.

### **2. Health Checks**
Enable actuator health checks in all services:
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### **3. Instance IDs**
Use unique instance IDs for multiple instances:
```yaml
eureka:
 instance:
  instance-id: ${spring.application.name}:${server.port}
```

### **4. Load Balancing**
Gateway automatically load balances across instances:
```
Client → Gateway → [Instance 1, Instance 2, Instance 3]
```

---

## 📈 Advanced Features

### **Service Groups**

Group services by availability zone:

```yaml
eureka:
 instance:
  metadata-map:
   zone: us-east-1a
```

### **Custom Health Indicators**

Add custom health checks:

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        // Custom health check logic
       return Health.up().build();
    }
}
```

### **Eureka Cluster**

For high availability, run multiple Eureka servers:

```yaml
eureka:
 client:
 service-url:
     defaultZone: http://peer1:9095/eureka/,http://peer2:9095/eureka/
```

---

## ✅ Success Checklist

- [ ] Eureka Server started on port 9095
- [ ] Dashboard accessible at http://localhost:9095
- [ ] All services registered successfully
- [ ] Services showing as UP
- [ ] Can call services through Gateway
- [ ] Health checks passing
- [ ] Logs show successful registration

---

## 🎉 You're Ready!

Your Eureka Service Discovery is now fully configured and ready to discover all microservices!

**Access Points:**
- **Eureka Dashboard**: http://localhost:9095
- **API Gateway**: http://localhost:9096
- **All Swagger UIs**: http://localhost:{port}/swagger-ui.html

**Next:**Start your services and watch them register in real-time! 🚀

---

*Eureka Service Discovery - Production Ready!*
