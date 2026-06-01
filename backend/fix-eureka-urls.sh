#!/bin/bash

echo "🔧 Fixing Eureka URLs in all microservices"
echo "=========================================="
echo ""

cd /home/psd/Downloads/GlobalHub/backend

# Services to fix
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
  config_file="$service/src/main/resources/application.yml"
    
  if [ ! -f "$config_file" ]; then
      echo "⚠️  $config_file not found, skipping..."
     continue
    fi
    
  echo "Fixing $service..."
    
  # Replace old Eureka URL with correct one
  sed -i 's|defaultZone: http://localhost:[0-9]*/eureka/|defaultZone: http://localhost:9095/eureka/|g' "$config_file"
    
  # Add instance configuration if missing
  if ! grep -q "lease-renewal-interval-in-seconds" "$config_file"; then
      # Find the line with prefer-ip-address and add after it
      sed -i '/prefer-ip-address: true/a\    lease-renewal-interval-in-seconds: 10\n    lease-expiration-duration-in-seconds: 30' "$config_file"
  fi
    
  echo "  ✓ Fixed Eureka URL"
done

echo ""
echo "✅ All Eureka URLs updated!"
echo ""
echo "Correct configuration:"
echo "  Eureka Server: http://localhost:9095/eureka/"
echo ""
echo "Next Steps:"
echo "  1. Rebuild services: mvn clean install -DskipTests"
echo "  2. Restart all services"
echo "  3. Check Eureka dashboard: http://localhost:9095"
echo ""
