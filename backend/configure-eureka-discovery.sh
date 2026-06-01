#!/bin/bash

echo "🔧 Configuring Eureka Service Discovery for all microservices"
echo "=============================================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Function to create/update application.yml with Eureka config
create_eureka_config() {
  local service_dir=$1
  local port=$2
  local db_name=$3
  local app_name=$4
    
  local config_file="$service_dir/src/main/resources/application.yml"
    
  mkdir -p "$service_dir/src/main/resources"
    
  cat > "$config_file" << EOF
server:
 port:$port

spring:
  application:
  name: $app_name
  
 datasource:
 url: jdbc:mysql://localhost:3306/$db_name?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
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
     defaultZone: http://localhost:9095/eureka/
 instance:
  prefer-ip-address: true
  lease-renewal-interval-in-seconds: 10
  lease-expiration-duration-in-seconds:30
  health-check-url-path: /actuator/health

management:
 endpoints:
   web:
    exposure:
       include: health,info
 endpoint:
  health:
     show-details: always

springdoc:
 api-docs:
   path: /api-docs
 swagger-ui:
   path: /swagger-ui.html
   enabled: true
EOF

  echo "✓ Configured $service_dir (Port: $port)"
}

echo "Updating all microservices with Eureka configuration...\n"

# Product Service
create_eureka_config"globalhub-product-service" 9100 "globalhub_products" "product-service"

# Hotel Service
create_eureka_config "globalhub-hotel-service" 9101 "globalhub_hotels" "hotel-service"

# Property Service
create_eureka_config "globalhub-property-service" 9102 "globalhub_properties" "property-service"

# Tour Service
create_eureka_config "globalhub-tour-service" 9103 "globalhub_tours" "tour-service"

# Order Service
create_eureka_config "globalhub-order-service" 9104 "globalhub_orders" "order-service"

# Payment Service
create_eureka_config "globalhub-payment-service" 9105 "globalhub_payments" "payment-service"

# Notification Service
create_eureka_config"globalhub-notification-service" 9106 "globalhub_notifications" "notification-service"

echo ""
echo "✅ All microservices configured for Eureka discovery!"
echo ""
echo "📋 Configuration Summary:"
echo "  Eureka Server: http://localhost:9095"
echo "  API Gateway: http://localhost:9096"
echo ""
echo "Registered Services:"
echo "  • Auth Service      → Port 9097"
echo "  • User Service      → Port 9098"
echo "  • Vendor Service    → Port 9099"
echo "  • Product Service   → Port 9100"
echo "  • Hotel Service     → Port 9101"
echo "  • Property Service  → Port 9102"
echo "  • Tour Service      → Port 9103"
echo "  • Order Service     → Port 9104"
echo "  • Payment Service   → Port 9105"
echo "  • Notification Service → Port 9106"
echo ""
echo "Next Steps:"
echo "  1. Build services: mvn clean install -DskipTests"
echo " 2. Start Eureka: cd globalhub-eureka && mvn spring-boot:run"
echo "  3. Start services in separate terminals"
echo "  4. View dashboard: http://localhost:9095"
echo ""
