#!/bin/bash

echo "🔧 Updating all microservices to MySQL with new ports (9095+)"
echo "=============================================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Define services with their new ports
declare-A service_ports=(
    ["globalhub-eureka"]=9095
    ["globalhub-gateway"]=9096
    ["globalhub-auth-service"]=9097
    ["globalhub-user-service"]=9098
    ["globalhub-vendor-service"]=9099
    ["globalhub-product-service"]=9100
    ["globalhub-hotel-service"]=9101
    ["globalhub-property-service"]=9102
    ["globalhub-tour-service"]=9103
    ["globalhub-order-service"]=9104
    ["globalhub-payment-service"]=9105
    ["globalhub-notification-service"]=9106
)

# Function to update application.yml for a service
update_service() {
   local service_dir=$1
   local port=$2
   local db_name=$3
    
   local config_file="$service_dir/src/main/resources/application.yml"
    
   if [ ! -f "$config_file" ]; then
       echo "⚠️  $config_file not found, creating it..."
       mkdir -p "$service_dir/src/main/resources"
        
        # Create basic application.yml
       cat > "$config_file" << EOF
server:
  port: $port

spring:
  application:
   name: ${service_dir#globalhub-}
  
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

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
EOF
       echo "  ✓ Created $config_file"
       return
    fi
    
   echo "Updating $service_dir..."
    
    # Update port
   sed -i "s/port: [0-9]*/port: $port/g" "$config_file"
    
    # Update database URL to MySQL
   sed -i 's|jdbc:postgresql://localhost:5432/[a-z_]*|jdbc:mysql://localhost:3306/'"$db_name"'?useSSL=false\&serverTimezone=UTC\&allowPublicKeyRetrieval=true|g' "$config_file"
    
    # Update username
   sed -i 's/username: postgres/username: root/g' "$config_file"
    
    # Update password
   sed -i 's/password: postgres/password: Password@224/g' "$config_file"
    
    # Update driver class
   sed -i 's/driver-class-name: org.postgresql.Driver/driver-class-name: com.mysql.cj.jdbc.Driver/g' "$config_file"
    
    # Update Hibernate dialect
   sed -i 's/dialect: org.hibernate.dialect.PostgreSQLDialect/dialect: org.hibernate.dialect.MySQLDialect/g' "$config_file"
    
    # Update Eureka URL to use new port 9095
   sed -i 's|defaultZone: http://localhost:[0-9]*/eureka/|defaultZone: http://localhost:9095/eureka/|g' "$config_file"
    
   echo "  ✓ Updated $service_dir (Port: $port, DB: $db_name)"
}

# Update each service
echo "📝 Updating configuration files..."
echo ""

update_service "globalhub-eureka" 9095 "globalhub_eureka"
update_service "globalhub-gateway" 9096 "globalhub_gateway"
update_service "globalhub-auth-service" 9097 "globalhub_auth"
update_service"globalhub-user-service" 9098 "globalhub_users"
update_service "globalhub-vendor-service" 9099 "globalhub_vendors"
update_service"globalhub-product-service" 9100 "globalhub_products"
update_service "globalhub-hotel-service" 9101 "globalhub_hotels"
update_service"globalhub-property-service" 9102 "globalhub_properties"
update_service "globalhub-tour-service" 9103 "globalhub_tours"
update_service"globalhub-order-service" 9104 "globalhub_orders"
update_service "globalhub-payment-service" 9105 "globalhub_payments"
update_service "globalhub-notification-service" 9106 "globalhub_notifications"

echo ""
echo "✅ All configurations updated!"
echo ""
echo "📋 New Port Assignments:"
echo "  9095 - Eureka Server"
echo "  9096 - API Gateway"
echo "  9097 - Auth Service"
echo "  9098 - User Service"
echo "  9099 - Vendor Service"
echo "  9100 - Product Service"
echo "  9101 - Hotel Service"
echo "  9102 - Property Service"
echo "  9103 - Tour Service"
echo "  9104 - Order Service"
echo "  9105 - Payment Service"
echo "  9106 - Notification Service"
echo ""
echo "🗄️ Database Configuration:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  Username: root"
echo "  Password: Password@224"
echo ""
echo "Next Steps:"
echo "  1. Run SQL schema: mysql-u root-pPassword@224 < database-schema.sql"
echo "  2. Build services: mvn clean install-DskipTests"
echo "  3. Start services: ./build-and-run-all.sh"
echo ""
