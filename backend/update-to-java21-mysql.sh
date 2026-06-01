#!/bin/bash

echo "🔧 Updating all microservices to Java 21 and MySQL"
echo "=================================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Services to update
services=(
    "globalhub-eureka"
    "globalhub-gateway"
    "globalhub-auth-service"
    "globalhub-user-service"
    "globalhub-vendor-service"
    "globalhub-product-service"
    "globalhub-hotel-service"
    "globalhub-property-service"
    "globalhub-tour-service"
    "globalhub-order-service"
    "globalhub-payment-service"
    "globalhub-notification-service"
)

echo "📝 Updating pom.xml files..."
echo ""

for service in "${services[@]}"; do
  pom_file="$service/pom.xml"
    
  if [ ! -f "$pom_file" ]; then
      echo "⚠️  $pom_file not found, skipping..."
     continue
    fi
    
  echo "Updating $service..."
    
    # Check if PostgreSQL dependency exists and remove it
  if grep-q "postgresql" "$pom_file"; then
        # Remove PostgreSQL dependency
      sed -i '/<dependency>/,/<\/dependency>/{
            /<groupId>org.postgresql<\/groupId>/,/<\/dependency>/d
       }' "$pom_file"
      echo "  ✓ Removed PostgreSQL dependency"
    fi
    
    # Add MySQL connector if not present (before </dependencies>)
  if ! grep-q "mysql-connector-j" "$pom_file"; then
      sed -i '/<\/dependencies>/i \
        <!-- MySQL Connector -->\
        <dependency>\
            <groupId>com.mysql</groupId>\
            <artifactId>mysql-connector-j</artifactId>\
            <version>8.0.33</version>\
            <scope>runtime</scope>\
        </dependency>' "$pom_file"
      echo "  ✓ Added MySQL connector"
   else
      echo "  ✓ MySQL connector already present"
    fi
    
    # Add Spring Boot Actuator if not present
  if ! grep-q "spring-boot-starter-actuator" "$pom_file"; then
       # Find spring-boot-starter-web and add actuator after it
      sed -i '/<artifactId>spring-boot-starter-web<\/artifactId>/,/<\/dependency>/a \
\
        <!-- Spring Boot Actuator for health checks -->\
        <dependency>\
            <groupId>org.springframework.boot</groupId>\
            <artifactId>spring-boot-starter-actuator</artifactId>\
        </dependency>' "$pom_file"
      echo "  ✓ Added Spring Boot Actuator"
   else
      echo "  ✓ Spring Boot Actuator already present"
    fi
    
done

echo ""
echo "✅ All pom.xml files updated!"
echo ""
echo "Changes made:"
echo "  • Java version: 21 (in parent pom.xml)"
echo "  • Database: MySQL 8.0.33"
echo "  • Removed: PostgreSQL dependencies"
echo "  • Added: Spring Boot Actuator for health checks"
echo ""
echo "Next Steps:"
echo "  1. Build services: mvn clean install -DskipTests"
echo "  2. Start services: ./build-and-run-all.sh"
echo "  3. Verify at Eureka: http://localhost:9095"
echo ""
