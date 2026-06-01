# Module Configuration Guide

GlobalHub uses a modular architecture where you can enable or disable specific features based on your needs.

## Current Configuration

By default, only these modules are enabled:
- **Auth Service** (always enabled) - User authentication and authorization
- **User Service** (always enabled) - User profile management
- **Vendor Service** (enabled) - Vendor registration and management
- **Property Service** (enabled) - Real estate and land listings

All other modules are disabled by default:
- Products (E-commerce marketplace)
- Hotels (Hotel booking system)
- Tours (Tour packages and bookings)
- Orders (Order management)
- Payments (Payment processing)
- Notifications (Notification service)

## How to Enable/Disable Modules

### Method 1: Edit Gateway Configuration File

Edit `backend/globalhub-gateway/src/main/resources/application.yml`:

```yaml
modules:
  products:
    enabled: false  # Change to true to enable
    description: "E-commerce product marketplace"
  
  hotels:
    enabled: false  # Change to true to enable
    description: "Hotel booking system"
  
  properties:
    enabled: true   # Currently enabled
    description: "Real estate and land listings"
  
  # ... other modules
```

### Method 2: Use Environment Variables

You can override module settings using environment variables:

```bash
# Enable products module
export MODULES_PRODUCTS_ENABLED=true

# Disable properties module
export MODULES_PROPERTIES_ENABLED=false
```

### Method 3: Command Line Arguments

When starting the gateway:

```bash
java -jar globalhub-gateway.jar --modules.products.enabled=true
```

## Checking Module Status

### From Frontend

```javascript
import api from './api/apiClient';

// Get enabled modules
const status = await api.modules.getStatus();
console.log(status.modules);
// Output: { products: false, hotels: false, properties: true, ... }

// Check if a specific module is enabled
const isEnabled = await api.modules.isEnabled('properties');
console.log(isEnabled); // true
```

### From API

```bash
# Get module status
curl http://localhost:9096/api/modules

# Get detailed module information
curl http://localhost:9096/api/modules/status
```

## Service Dependencies

Some modules depend on others:

- **Properties** requires **Vendors** (vendors can list properties)
- **Orders** requires **Products** or **Hotels** or **Tours**
- **Payments** requires **Orders**

Make sure to enable dependent modules together.

## Starting Only Required Services

When modules are disabled, you don't need to start those services:

### Minimal Setup (Properties Only)
```bash
# Start only these services:
cd backend/globalhub-eureka && mvn spring-boot:run &
cd backend/globalhub-gateway && mvn spring-boot:run &
cd backend/globalhub-auth-service && mvn spring-boot:run &
cd backend/globalhub-user-service && mvn spring-boot:run &
cd backend/globalhub-vendor-service && mvn spring-boot:run &
cd backend/globalhub-property-service && mvn spring-boot:run &
```

### Full Setup (All Modules)
```bash
# Start all services including:
# - product-service
# - hotel-service
# - tour-service
# - order-service
# - payment-service
# - notification-service
```

## Frontend Integration

The frontend automatically adapts based on enabled modules. Navigation menus and features will only show for enabled modules.

Example in React:

```javascript
import { useEffect, useState } from 'react';
import api from './api/apiClient';

function App() {
  const [modules, setModules] = useState({});

  useEffect(() => {
    api.modules.getStatus().then(data => {
      setModules(data.modules);
    });
  }, []);

  return (
    <div>
      {modules.products && <ProductsMenu />}
      {modules.hotels && <HotelsMenu />}
      {modules.properties && <PropertiesMenu />}
      {modules.tours && <ToursMenu />}
    </div>
  );
}
```

## Benefits of Modular Architecture

1. **Reduced Resource Usage** - Only run services you need
2. **Faster Development** - Focus on specific features
3. **Easier Maintenance** - Update modules independently
4. **Scalability** - Scale only the modules under load
5. **Flexibility** - Enable features as your business grows

## Troubleshooting

### Module Not Working After Enabling

1. Make sure the corresponding service is running
2. Check that the service is registered with Eureka: http://localhost:7070
3. Restart the gateway after changing configuration
4. Clear browser cache and reload frontend

### Gateway Returns 503 for Disabled Module

This is expected. The gateway will return 503 Service Unavailable if you try to access a disabled module's endpoints.

## Production Recommendations

For production deployments:

1. Enable only the modules you're actively using
2. Use environment variables for configuration
3. Document which modules are enabled in your deployment
4. Monitor service health for enabled modules only
5. Set up proper database schemas only for enabled modules
