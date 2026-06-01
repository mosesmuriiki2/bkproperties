#!/bin/bash

echo "🔧 Complete Configuration Fix - Ports & Eureka"
echo "=============================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Service configurations: name|port|database
declare -A services=(
    ["globalhub-gateway"]="9096|globalhub_gateway"
    ["globalhub-auth-service"]="9097|globalhub_auth"
    ["globalhub-user-service"]="9098|globalhub_users"
    ["globalhub-vendor-service"]="9099|globalhub_vendors"
    ["globalhub-product-service"]="9100|globalhub_products"
    ["globalhub-hotel-service"]="9101|globalhub_hotels"
    ["globalhub-property-service"]="9102|globalhub_properties"
    ["globalhub-tour-service"]="9103|globalhub_tours"
    ["globalhub-order-service"]="9104|globalhub_orders"
    ["globalhub-payment-service"]="9105|globalhub_payments"
    ["globalhub-notification-service"]="9106|globalhub_notifications"
)

for service in "${!services[@]}"; do
  config_file="$service/src/main/resources/application.yml"
    
  if [ ! -f "$config_file" ]; then
      echo "⚠️  $config_file not found, skipping..."
     continue
    fi
    
  IFS='|' read -r port database <<< "${services[$service]}"
    
  echo "Fixing $service (Port: $port, DB: $database)..."
    
  # Fix server port
  sed -i 's|^server:\n  port:.*|server:\n  port: '"$port"'|' "$config_file"
    
  # Fix Eureka URL
  sed -i 's|defaultZone: http://localhost:[0-9]*/eureka/|defaultZone: http://localhost:9095/eureka/|g' "$config_file"
    
  # Add instance configuration if missing
  if ! grep -q "lease-renewal-interval-in-seconds" "$config_file"; then
      sed -i '/prefer-ip-address: true/a\    lease-renewal-interval-in-seconds: 10\n    lease-expiration-duration-in-seconds: 30' "$config_file"
  fi
    
  echo "  ✓ Port set to $port"
  echo "  ✓ Eureka URL fixed"
done

echo ""
echo "✅ All configurations updated!"
echo ""
echo "📋 Correct Port Map:"
echo "  Eureka Server     : 9095"
echo "  API Gateway       : 9096"
echo "  Auth Service      : 9097"
echo "  User Service      : 9098"
echo "  Vendor Service    : 9099"
echo "  Product Service   : 9100"
echo "  Hotel Service     : 9101"
echo "  Property Service  : 9102"
echo "  Tour Service      : 9103"
echo "  Order Service     : 9104"
echo "  Payment Service   : 9105"
echo "  Notification Svc  : 9106"
echo ""
echo "Next Steps:"
echo "  1. Clean build: mvn clean install -DskipTests"
echo "  2. Start Eureka: cd globalhub-eureka && mvn spring-boot:run"
echo "  3. Start Gateway: cd globalhub-gateway && mvn spring-boot:run"
echo "  4. Start other services in separate terminals"
echo "  5. Verify at: http://localhost:9095"
echo ""
