#!/bin/bash

echo "🔧 Updating all microservices to use MySQL database..."
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Function to update application.yml for each service
update_service_config() {
   local service_dir=$1
   local db_name=$2
    
    if [ ! -d "$service_dir" ]; then
       echo "⚠️  $service_dir not found, skipping..."
      return
    fi
    
   local config_file="$service_dir/src/main/resources/application.yml"
    
    if [ ! -f "$config_file" ]; then
       echo "⚠️  $config_file not found, skipping..."
      return
    fi
    
   echo "Updating $service_dir..."
    
    # Replace PostgreSQL with MySQL configuration
   sed -i 's|jdbc:postgresql://localhost:5432/'"$db_name"'|jdbc:mysql://localhost:3306/'"$db_name"'?useSSL=false\&serverTimezone=UTC\&allowPublicKeyRetrieval=true|g' "$config_file"
   sed -i 's|username: postgres|username: root|g' "$config_file"
   sed -i 's|password: postgres|password: Password@224|g' "$config_file"
   sed -i 's|driver-class-name: org.postgresql.Driver|driver-class-name: com.mysql.cj.jdbc.Driver|g' "$config_file"
   sed -i 's|dialect: org.hibernate.dialect.PostgreSQLDialect|dialect: org.hibernate.dialect.MySQLDialect|g' "$config_file"
    
   echo "  ✓ Updated $service_dir"
}

# Update all services
update_service_config"globalhub-auth-service" "globalhub_auth"
update_service_config"globalhub-user-service" "globalhub_users"
update_service_config "globalhub-vendor-service" "globalhub_vendors"
update_service_config"globalhub-product-service" "globalhub_products"
update_service_config "globalhub-hotel-service" "globalhub_hotels"
update_service_config"globalhub-property-service" "globalhub_properties"
update_service_config "globalhub-tour-service" "globalhub_tours"
update_service_config"globalhub-order-service" "globalhub_orders"
update_service_config "globalhub-payment-service" "globalhub_payments"
update_service_config "globalhub-notification-service" "globalhub_notifications"

echo ""
echo "✅ All microservices configured to use MySQL!"
echo ""
echo "Database Configuration:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  User: root"
echo "  Password: Password@224"
echo ""
echo "Next steps:"
echo "1. Run the SQL schema: mysql -u root-pPassword@224 < database-schema.sql"
echo "2. Build services: mvn clean install -DskipTests"
echo "3. Start services: ./build-and-run-all.sh"
