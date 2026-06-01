#!/bin/bash

echo "🐬 Setting up MySQL for all GlobalHub microservices"
echo "===================================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Step 1: Add MySQL connector to all pom.xml files
echo "📦 Step 1: Adding MySQL connector to all services..."

services=(
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

for service in "${services[@]}"; do
  pom_file="$service/pom.xml"
    
   if [ ! -f "$pom_file" ]; then
      echo "⚠️  $pom_file not found, skipping..."
     continue
    fi
    
  echo "  Updating $service..."
    
    # Check if MySQL connector already exists
   if grep-q "mysql-connector-j" "$pom_file"; then
      echo "    ✓ MySQL connector already present"
     continue
    fi
    
    # Add MySQL connector before closing </dependencies> tag
  sed -i '/<\/dependencies>/i \
        <!-- MySQL Connector -->\
        <dependency>\
            <groupId>com.mysql</groupId>\
            <artifactId>mysql-connector-j</artifactId>\
            <version>8.0.33</version>\
            <scope>runtime</scope>\
        </dependency>' "$pom_file"
    
  echo "    ✓ MySQL connector added"
done

echo ""
echo "✅ All pom.xml files updated with MySQL connector"
echo ""

# Step 2: Test MySQL connection
echo "🔍 Step 2: Testing MySQL connection..."

if mysql-u root-pPassword@224 -e "SELECT 1;" > /dev/null 2>&1; then
  echo "✅ MySQL connection successful!"
else
  echo "❌ Cannot connect to MySQL. Please check:"
  echo "   1. MySQL is running (sudo systemctl status mysql)"
  echo "  2. Password is correct"
  exit 1
fi

echo ""

# Step 3: Create databases
echo "📊 Step 3: Creating databases..."

databases=(
    "globalhub_auth"
    "globalhub_users"
    "globalhub_vendors"
    "globalhub_products"
    "globalhub_hotels"
    "globalhub_properties"
    "globalhub_tours"
    "globalhub_orders"
    "globalhub_payments"
    "globalhub_notifications"
)

for db in "${databases[@]}"; do
  echo -n "  Creating $db... "
    mysql -u root-pPassword@224 -e "CREATE DATABASE IF NOT EXISTS $db;" 2>/dev/null
    
   if [ $? -eq 0 ]; then
      echo "✓"
   else
      echo "✗ (may already exist)"
    fi
done

echo ""

# Step 4: Run schema script
echo "📝 Step 4: Running database schema script..."

if [ -f "database-schema.sql" ]; then
  echo "  Executing database-schema.sql..."
    mysql -u root-pPassword@224 < database-schema.sql
    
   if [ $? -eq 0 ]; then
      echo "✅ Database schema created successfully!"
   else
      echo "⚠️  Some errors occurred. Check MySQL output above."
    fi
else
  echo "⚠️  database-schema.sql not found, skipping..."
fi

echo ""

# Step 5: Verify tables
echo "🔍 Step 5: Verifying tables..."

for db in "${databases[@]}"; do
  table_count=$(mysql-u root-pPassword@224 -N -e "USE $db; SHOW TABLES;" 2>/dev/null | wc -l)
  echo "  $db: $table_count tables"
done

echo ""
echo "===================================================="
echo "✅ MySQL setup complete!"
echo "===================================================="
echo ""
echo "Database Configuration:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  User: root"
echo "  Password: Password@224"
echo ""
echo "Databases Created:"
for db in "${databases[@]}"; do
  echo "  - $db"
done
echo ""
echo "Next Steps:"
echo "  1. Build services: mvn clean install -DskipTests"
echo "  2. Start services: ./build-and-run-all.sh"
echo "  3. View Eureka: http://localhost:8761"
echo ""
