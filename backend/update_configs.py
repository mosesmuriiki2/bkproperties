#!/usr/bin/env python3
import os
import re

print("🔧 Updating all microservices to MySQL with new ports (9095+)")
print("=" * 70)
print()

base_dir = "/home/psd/Downloads/GlobalHub/backend"

# Services with their new ports and databases
services = {
    "globalhub-eureka": {"port": 9095, "db": "globalhub_eureka"},
    "globalhub-gateway": {"port": 9096, "db": "globalhub_gateway"},
    "globalhub-auth-service": {"port": 9097, "db": "globalhub_auth"},
    "globalhub-user-service": {"port": 9098, "db": "globalhub_users"},
    "globalhub-vendor-service": {"port": 9099, "db": "globalhub_vendors"},
    "globalhub-product-service": {"port": 9100, "db": "globalhub_products"},
    "globalhub-hotel-service": {"port": 9101, "db": "globalhub_hotels"},
    "globalhub-property-service": {"port": 9102, "db": "globalhub_properties"},
    "globalhub-tour-service": {"port": 9103, "db": "globalhub_tours"},
    "globalhub-order-service": {"port": 9104, "db": "globalhub_orders"},
    "globalhub-payment-service": {"port": 9105, "db": "globalhub_payments"},
    "globalhub-notification-service": {"port": 9106, "db": "globalhub_notifications"},
}

def update_application_yml(service_dir, port, db_name):
   config_file = os.path.join(base_dir, service_dir, "src/main/resources/application.yml")
    
   if not os.path.exists(config_file):
        print(f"⚠️  {config_file} not found, creating...")
        os.makedirs(os.path.dirname(config_file), exist_ok=True)
        
        # Create new application.yml
       content = f"""server:
  port: {port}

spring:
  application:
  name: {service_dir.replace('globalhub-', '')}
  
  datasource:
  url: jdbc:mysql://localhost:3306/{db_name}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
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
"""
        with open(config_file, 'w') as f:
            f.write(content)
        print(f"  ✓ Created {config_file}")
       return
    
    print(f"Updating {service_dir}...")
    
    with open(config_file, 'r') as f:
       content = f.read()
    
    # Update port
   content = re.sub(r'port: \d+', f'port: {port}', content)
    
    # Update database URL to MySQL
   content = re.sub(
       r'jdbc:postgresql://localhost:5432/[a-z_]+',
        f'jdbc:mysql://localhost:3306/{db_name}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true',
       content
    )
    
    # Update username
   content = re.sub(r'username: postgres', 'username: root', content)
    
    # Update password
   content = re.sub(r'password: postgres', 'password: Password@224', content)
    
    # Update driver class
   content = re.sub(
       r'driver-class-name: org.postgresql.Driver',
        'driver-class-name: com.mysql.cj.jdbc.Driver',
       content
    )
    
    # Update Hibernate dialect
   content = re.sub(
       r'dialect: org.hibernate.dialect.PostgreSQLDialect',
        'dialect: org.hibernate.dialect.MySQLDialect',
       content
    )
    
    # Update Eureka URL to use new port 9095
   content = re.sub(
       r'defaultZone: http://localhost:\d+/eureka/',
        'defaultZone: http://localhost:9095/eureka/',
       content
    )
    
    with open(config_file, 'w') as f:
        f.write(content)
    
    print(f"  ✓ Updated {service_dir} (Port: {port}, DB: {db_name})")

# Update each service
print("📝 Updating configuration files...\n")

for service_dir, config in services.items():
    update_application_yml(service_dir, config["port"], config["db"])

print()
print("✅ All configurations updated!")
print()
print("📋 New Port Assignments:")
print("  9095 - Eureka Server")
print("  9096 - API Gateway")
print("  9097 - Auth Service")
print("  9098 - User Service")
print("  9099 - Vendor Service")
print("  9100 - Product Service")
print("  9101 - Hotel Service")
print("  9102 - Property Service")
print("  9103 - Tour Service")
print("  9104 - Order Service")
print("  9105 - Payment Service")
print("  9106 - Notification Service")
print()
print("🗄️ Database Configuration:")
print("  Host: localhost")
print("  Port: 3306")
print("  Username: root")
print("  Password: Password@224")
print()
print("Next Steps:")
print("  1. Run SQL schema: mysql-u root-pPassword@224 < database-schema.sql")
print("  2. Build services: mvn clean install -DskipTests")
print("  3. Start services: ./build-and-run-all.sh")
print()
