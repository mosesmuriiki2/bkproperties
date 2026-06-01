# 🐬 MySQL Database Setup Guide for GlobalHub

## ✅ Complete MySQL Configuration

All microservices have been configured to connect to your MySQL database.

---

## 📋 Database Credentials

```
Host: localhost
Port: 3306
Username: root
Password: Password@224
Schema/Database: global_hub (contains all service databases)
```

---

## 🚀 Quick Setup Steps

### **Step 1: Create Databases and Tables**

Run the SQL schema script to create all databases and tables:

```bash
cd /home/psd/Downloads/GlobalHub/backend

# Option 1: Using command line
mysql -u root-pPassword@224 < database-schema.sql

# Option 2: Login to MySQL first
mysql -u root-pPassword@224
source database-schema.sql
exit;
```

This will create:
- `globalhub_auth` - Authentication & users
- `globalhub_users` - User profiles & addresses
- `globalhub_vendors` - Vendors & documents
- `globalhub_products` - Products & categories
- `globalhub_hotels` - Hotels, rooms & bookings
- `globalhub_properties` - Properties & listings
- `globalhub_tours` - Tour packages & vehicles
- `globalhub_orders` - Orders & tracking
- `globalhub_payments` - Payments & refunds
- `globalhub_notifications` - Notifications & templates

---

### **Step 2: Add MySQL Connector to Maven Dependencies**

The MySQL connector has been added to all pom.xml files. If you need to add it manually:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
    <scope>runtime</scope>
</dependency>
```

Remove PostgreSQL dependency if present:
```xml
<!-- Remove or comment out -->
<!-- 
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
-->
```

---

### **Step 3: Verify Database Connection**

Test connection to each database:

```bash
# Test auth database
mysql-u root-pPassword@224 -e "USE globalhub_auth; SHOW TABLES;"

# Test products database
mysql-u root-pPassword@224 -e "USE globalhub_products; SHOW TABLES;"

# Test hotels database
mysql -u root-pPassword@224 -e "USE globalhub_hotels; SHOW TABLES;"
```

You should see all tables created by the schema script.

---

### **Step 4: Build All Microservices**

```bash
cd /home/psd/Downloads/GlobalHub/backend
mvn clean install -DskipTests
```

This ensures all services compile with MySQL dependencies.

---

### **Step 5: Start Services**

```bash
# Start all services at once
./build-and-run-all.sh

# OR start individually in separate terminals
cd globalhub-eureka && mvn spring-boot:run
cd globalhub-gateway && mvn spring-boot:run
cd globalhub-auth-service && mvn spring-boot:run
# ... etc for other services
```

---

## 🔍 Verify Database Integration

### **Check Tables Created**

```sql
-- Connect to MySQL
mysql -u root-pPassword@224

-- Show all databases
SHOW DATABASES;

-- Use auth database
USE globalhub_auth;

-- Show tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Insert a test user
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES ('test@example.com', '$2a$10$N5XoMl9IvJxkz8qQJ5L5LuT7hVZ9qGJ5K5L5LuT7hVZ9qGJ5K5L5L', 'Test', 'User', 'CONSUMER');

-- Verify insertion
SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 📊 Database Schema Overview

### **Auth Service Database** (`globalhub_auth`)
- `users` - User accounts with authentication data

### **User Service Database** (`globalhub_users`)
- `user_profiles` - Extended user information
- `addresses` - User saved addresses

### **Vendor Service Database** (`globalhub_vendors`)
- `vendors` - Vendor business information
- `vendor_documents` - Verification documents

### **Product Service Database** (`globalhub_products`)
- `products` - Product catalog
- `product_images` - Product image URLs
- `categories` - Product categories

### **Hotel Service Database** (`globalhub_hotels`)
- `hotels` - Hotel information
- `rooms` - Hotel rooms
- `hotel_bookings` - Room reservations

### **Property Service Database** (`globalhub_properties`)
- `properties` - Real estate listings
- `property_images` - Property photos

### **Tour Service Database** (`globalhub_tours`)
- `tour_packages` - Tour offerings
- `tourist_vehicles` - Rental vehicles
- `tour_bookings` - Tour reservations

### **Order Service Database** (`globalhub_orders`)
- `orders` - Customer orders
- `order_tracking` - Order status updates

### **Payment Service Database** (`globalhub_payments`)
- `payments` - Payment transactions
- `refunds` - Refund records

### **Notification Service Database** (`globalhub_notifications`)
- `notifications` - Sent notifications
- `notification_templates` - Email/SMS templates

---

## 🧪 Testing Database Operations

### **1. Test User Registration**

When a user registers via the API:
```bash
curl -X POST http://localhost:8080/api/auth/register\
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Check in database:
```sql
USE globalhub_auth;
SELECT * FROM users WHERE email = 'john@example.com';
```

### **2. Test Product Creation**

```bash
curl -X POST http://localhost:8080/api/products\
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": 1,
    "name": "Luxury Car",
    "description": "Premium vehicle",
    "category": "cars",
    "price": 45000.00
  }'
```

Check in database:
```sql
USE globalhub_products;
SELECT * FROM products ORDER BY id DESC LIMIT 5;
```

### **3. Test Hotel Booking**

```bash
curl -X POST http://localhost:8080/api/hotels/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "userId": 1,
    "checkIn": "2024-04-01",
    "checkOut": "2024-04-05",
    "guests": 2
  }'
```

Check in database:
```sql
USE globalhub_hotels;
SELECT * FROM hotel_bookings ORDER BY id DESC LIMIT 5;
```

---

## 🔧 Troubleshooting

### **Connection Refused Error**

If you see: `Communications link failure`

1. **Check MySQL is running:**
   ```bash
   sudo systemctl status mysql
   # or
   sudo systemctl status mysqld
   ```

2. **Start MySQL if not running:**
   ```bash
   sudo systemctl start mysql
   ```

3. **Verify port:**
   ```bash
  netstat -tlnp | grep 3306
   ```

### **Access Denied Error**

If you see: `Access denied for user 'root'@'localhost'`

1. **Reset password:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Password@224';
   FLUSH PRIVILEGES;
   ```

2. **Grant privileges:**
   ```sql
   GRANT ALL PRIVILEGES ON globalhub_*.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### **Database Not Found**

If you see: `Unknown database 'globalhub_auth'`

1. **Run the schema script again:**
   ```bash
   mysql -u root-pPassword@224 < database-schema.sql
   ```

2. **Or create manually:**
   ```sql
   CREATE DATABASE globalhub_auth;
   CREATE DATABASE globalhub_users;
   -- ... repeat for all databases
   ```

### **Table Not Created**

Hibernate should auto-create tables with `ddl-auto: update`. If not:

1. **Check logs:**
   ```bash
  tail -f logs/globalhub-auth-service.log | grep -i "table\|schema"
   ```

2. **Enable SQL logging:**
   Edit `application.yml`:
   ```yaml
  jpa:
     show-sql: true
     properties:
      hibernate:
         format_sql: true
   ```

---

## 📈 Database Monitoring

### **View Active Connections**

```sql
SHOW PROCESSLIST;
```

### **Check Database Size**

```sql
SELECT 
   table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema LIKE 'globalhub%'
GROUP BY table_schema;
```

### **Recent Records**

```sql
-- Recent users
USE globalhub_auth;
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Recent products
USE globalhub_products;
SELECT * FROM products ORDER BY created_at DESC LIMIT 10;

-- Recent bookings
USE globalhub_hotels;
SELECT * FROM hotel_bookings ORDER BY booked_at DESC LIMIT 10;
```

---

## 🎯 Best Practices

### **1. Backup Databases**

```bash
# Backup all databases
mysqldump -u root-pPassword@224 --all-databases > backup_all.sql

# Backup specific database
mysqldump -u root-pPassword@224 globalhub_products > backup_products.sql

# Restore from backup
mysql -u root-pPassword@224 < backup_all.sql
```

### **2. Optimize Tables**

```sql
-- Analyze tables
ANALYZE TABLE users;
ANALYZE TABLE products;

-- Optimize tables
OPTIMIZE TABLE users;
OPTIMIZE TABLE products;
```

### **3. Index Optimization**

Check query performance:
```sql
EXPLAIN SELECT * FROM products WHERE category = 'cars';
```

Add indexes if needed:
```sql
CREATE INDEX idx_category_price ON products(category, price);
```

---

## 📊 Entity Relationship Diagram

```
users (Auth)
  │
  ├─→ user_profiles (Users)
  │     └─→ addresses (Users)
  │
  ├─→ vendors (Vendors)
  │     ├─→ products (Products)
  │     │     └─→ product_images (Products)
  │     ├─→ hotels (Hotels)
  │     │     ├─→ rooms (Hotels)
  │     │     └─→ hotel_bookings (Hotels)
  │     ├─→ properties (Properties)
  │     │     └─→ property_images (Properties)
  │     └─→ tour_packages (Tours)
  │           └─→ tour_bookings (Tours)
  │
  └─→ orders(Orders)
        ├─→ order_tracking (Orders)
        └─→ payments (Payments)
              └─→ refunds (Payments)
```

---

## ✅ Verification Checklist

- [ ] MySQL is running on port 3306
- [ ] All 10 databases created
- [ ] All tables created successfully
- [ ] Can connect to each database
- [ ] Hibernate auto-creates tables
- [ ] Can insert/test data
- [ ] Services start without DB errors
- [ ] API calls persist to database
- [ ] Data can be retrieved from DB

---

## 🎉 Success!

Your GlobalHub platform is now fully integrated with MySQL!

**Database is ready to handle:**
- ✅ User registration & authentication
- ✅ Vendor onboarding
- ✅ Product catalog management
- ✅ Hotel bookings
- ✅ Property listings
- ✅ Tour packages
- ✅ Order processing
- ✅ Payment transactions
- ✅ Notifications

**Next:** Start the services and begin testing!

```bash
./build-and-run-all.sh
```

---

*GlobalHub - MySQL Integration Complete!* 🐬🚀
