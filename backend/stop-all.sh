#!/bin/bash

# Stop All GlobalHub Microservices
echo "🛑 Stopping all GlobalHub services..."
echo ""

# Kill services by PID files
if [ -d "logs" ]; then
    for pidfile in logs/*.pid; do
        if [ -f "$pidfile" ]; then
            service_name=$(basename "$pidfile" .pid)
            pid=$(cat "$pidfile")
            
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid"
                echo "✓ Stopped $service_name (PID: $pid)"
            else
                echo "⚠ $service_name not running"
            fi
            
            rm "$pidfile"
        fi
    done
else
    echo "Logs directory not found. Trying to kill by process name..."
    
    # Kill Java processes related to our services
    pkill -f "globalhub-eureka"
    echo "✓ Eureka Server stopped"
    
    pkill -f "globalhub-gateway"
    echo "✓ API Gateway stopped"
    
    pkill -f "globalhub-auth-service"
    echo "✓ Auth Service stopped"
    
    pkill -f "globalhub-user-service"
    echo "✓ User Service stopped"
    
    pkill -f "globalhub-vendor-service"
    echo "✓ Vendor Service stopped"
    
    pkill -f "globalhub-product-service"
    echo "✓ Product Service stopped"
    
    pkill -f "globalhub-hotel-service"
    echo "✓ Hotel Service stopped"
    
    pkill -f "globalhub-property-service"
    echo "✓ Property Service stopped"
    
    pkill -f "globalhub-tour-service"
    echo "✓ Tour Service stopped"
    
    pkill -f "globalhub-order-service"
    echo "✓ Order Service stopped"
    
    pkill -f "globalhub-payment-service"
    echo "✓ Payment Service stopped"
    
    pkill -f "globalhub-notification-service"
    echo "✓ Notification Service stopped"
fi

echo ""
echo "✅ All services stopped!"
