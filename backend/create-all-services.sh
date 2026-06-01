#!/bin/bash

# Create all remaining microservices structure
echo "🚀 Creating all microservices..."

cd /home/psd/Downloads/GlobalHub/backend

# Services to create
services=(
    "globalhub-product-service:8084:globalhub_products:Product Service"
    "globalhub-hotel-service:8085:globalhub_hotels:Hotel Service"
    "globalhub-property-service:8086:globalhub_properties:Property Service"
    "globalhub-tour-service:8087:globalhub_tours:Tour Service"
    "globalhub-order-service:8088:globalhub_orders:Order Service"
    "globalhub-payment-service:8089:globalhub_payments:Payment Service"
    "globalhub-notification-service:8090:globalhub_notifications:Notification Service"
)

for service_info in "${services[@]}"; do
    IFS=':' read -r dir port db name <<< "$service_info"
    
    echo ""
    echo "Creating $name ($dir)..."
    
    # Create directory structure
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/entity"
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/repository"
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/controller"
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/service"
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/dto"
    mkdir -p "$dir/src/main/java/com/globalhub/${dir#globalhub-}/config"
    mkdir -p "$dir/src/test/java/com/globalhub/${dir#globalhub-}"
    
    # Create pom.xml
    cat > "$dir/pom.xml" << 'POM_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.globalhub</groupId>
        <artifactId>globalhub-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>SERVICE_ARTIFACT_ID</artifactId>
    <name>SERVICE_NAME</name>
    <description>SERVICE_DESCRIPTION</description>
    
    <dependencies>
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
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
        
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
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
            </plugin>
        </plugins>
    </build>
</project>
POM_EOF

    # Update pom.xml with correct artifact ID and name
    sed -i "s/SERVICE_ARTIFACT_ID/$dir/g" "$dir/pom.xml"
    sed -i "s/SERVICE_NAME/$name/g" "$dir/pom.xml"
    sed -i "s|SERVICE_DESCRIPTION|$name for GlobalHub|g" "$dir/pom.xml"
    
    # Create Application class
    serviceName="${dir#globalhub-}"
    className=$(echo "${serviceName%-service}" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')Service
    
    cat > "$dir/src/main/java/com/globalhub/$serviceName/${className}Application.java" << EOF
package com.globalhub.$serviceName;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class $className {
    
    public static void main(String[] args) {
        SpringApplication.run($className.class, args);
    }
}
EOF

    # Create application.yml
    cat > "$dir/src/main/resources/application.yml" << EOF
server:
  port: $port

spring:
  application:
    name: $serviceName
  
  datasource:
    url: jdbc:postgresql://localhost:5432/$db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
EOF

    echo "✓ Created $name"
done

echo ""
echo "✅ All microservices structure created!"
echo ""
echo "Services created:"
echo "  - Product Service (8084)"
echo "  - Hotel Service (8085)"
echo "  - Property Service (8086)"
echo "  - Tour Service (8087)"
echo "  - Order Service (8088)"
echo "  - Payment Service (8089)"
echo "  - Notification Service (8090)"
echo ""
echo "Next steps:"
echo "1. Implement entities and repositories"
echo "2. Create controllers and services"
echo "3. Build: mvn clean install"
echo "4. Start services: ./start-all.sh"
