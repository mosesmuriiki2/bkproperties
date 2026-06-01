# ✅ MySQL Integration Complete- Ready to Connect!

## 🎉 Configuration Status

All microservices have been successfully configured to connect to your MySQL database.

---

## 📋 What Has Been Completed

### **1. Database Schema Created** ✅
- Complete SQL schema file: `database-schema.sql`
- 10 databases defined (one per service)
- All tables with proper relationships
- Indexes for performance
- Sample notification templates

### **2. All Services Configured for MySQL** ✅
Every microservice's `application.yml` has been updated:

```yaml
datasource:
  url: jdbc:mysql://localhost:3306/{database}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  username: root
  password: Password@224
  driver-class-name: com.mysql.cj.jdbc.Driver

jpa:
  properties:
    hibernate:
      dialect: org.hibernate.dialect.MySQLDialect
```

### **3. Maven Dependencies Updated** ✅
MySQL connector added to all `pom.xml` files:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
    <scope>runtime</scope>
</dependency>
```

---

## 🔧 Your Database Configuration

```
Host: localhost
Port: 3306
Username: root
Password: Password@224
Schema: global_hub (contains all service databases)
```

---

## 📊 Databases Overview

| # | Database | Service | Tables |
|---|----------|---------|--------|
| 1 | `globalhub_auth` | Auth Service | users |
| 2 | `globalhub_users` | User Service | user_profiles, addresses |
| 3 | `globalhub_vendors` | Vendor Service | vendors, vendor_documents |
| 4 | `globalhub_products` | Product Service | products, product_images, categories |
| 5 | `globalhub_hotels` | Hotel Service | hotels, rooms, hotel_bookings |
| 6 | `globalhub_properties` | Property Service | properties, property_images |
| 7 | `globalhub_tours` | Tour Service | tour_packages, tourist_vehicles, tour_bookings |
| 8 | `globalhub_orders` | Order Service | orders, order_tracking |
| 9 | `globalhub_payments` | Payment Service | payments, refunds |
| 10 | `globalhub_notifications` | Notification Service | notifications, notification_templates |

---

## ⚡ Quick Start Guide

### **Step 1: Ensure MySQL is Running**

```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Enable on boot (optional)
sudo systemctl enable mysql
```

### **Step 2: Run the Setup Script**

```bash
cd /home/psd/Downloads/GlobalHub/backend

# Make script executable
chmod +x setup-mysql.sh

# Run setup (creates databases and tables)
./setup-mysql.sh
```

**OR manually:**

```bash
# Login to MySQL
mysql -u root-pPassword@224

# Run the schema
source database-schema.sql

# Exit MySQL
exit;
```

### **Step 3: Verify Databases**

```bash
# Login to MySQL
mysql-u root-pPassword@224

# Show all databases
SHOW DATABASES;

# Use auth database
USE globalhub_auth;

# Show tables
SHOW TABLES;

# Should see: users table
```

### **Step 4: Build Services**

```bash
cd /home/psd/Downloads/GlobalHub/backend
mvn clean install -DskipTests
```

### **Step 5: Start All Services**

```bash
./build-and-run-all.sh
```

---

## 🗄️ Database Schema Details

### **Auth Service** (`globalhub_auth`)
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('CONSUMER', 'VENDOR', 'ADMIN') DEFAULT 'CONSUMER',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Products Service** (`globalhub_products`)
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
    description TEXT,
  category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
);
```

### **Hotels Service** (`globalhub_hotels`)
```sql
CREATE TABLE hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
    description TEXT,
  location VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
   country VARCHAR(100),
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
  capacity INT,
    beds INT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotel_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT,
    total_price DECIMAL(10,2),
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing Database Integration

### **Test 1: User Registration**

After starting services, register a user:

```bash
curl -X POST http://localhost:8080/api/auth/register\
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Check in MySQL:
```bash
mysql -u root-pPassword@224 -e "USE globalhub_auth; SELECT * FROM users;"
```

### **Test 2: Create Product**

```bash
curl -X POST http://localhost:8080/api/products\
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": 1,
    "name": "Test Product",
    "description": "A test product",
    "category": "electronics",
    "price": 99.99,
    "stockQuantity": 100
  }'
```

Check in MySQL:
```bash
mysql -u root-pPassword@224 -e "USE globalhub_products; SELECT * FROM products;"
```

### **Test 3: Book Hotel**

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

Check in MySQL:
```bash
mysql -u root-pPassword@224 -e "USE globalhub_hotels; SELECT * FROM hotel_bookings;"
```

---

## 🔍 Troubleshooting

### **MySQL Not Running**

```bash
# Check status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Check if listening on port 3306
netstat -tlnp | grep 3306
```

### **Access Denied**

```sql
-- Reset root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Password@224';
FLUSH PRIVILEGES;
```

### **Database Not Found**

Run the schema script again:
```bash
mysql -u root-pPassword@224 < backend/database-schema.sql
```

### **Tables Not Auto-Creating**

Hibernate should auto-create with`ddl-auto: update`. If not:
1. Check service logs for errors
2. Enable SQL logging in application.yml
3. Manually run CREATE TABLE statements from schema file

---

## 📈 Monitoring Queries

### **View All Databases**
```sql
SHOW DATABASES;
```

### **Count Records Across Databases**
```sql
SELECT 'auth' AS service, COUNT(*) AS count FROM globalhub_auth.users
UNION ALL
SELECT 'products', COUNT(*) FROM globalhub_products.products
UNION ALL
SELECT 'hotels', COUNT(*) FROM globalhub_hotels.hotels
UNION ALL
SELECT 'orders', COUNT(*) FROM globalhub_orders.orders;
```

### **Recent Activity**
```sql
-- Recent users
SELECT * FROM globalhub_auth.users ORDER BY created_at DESC LIMIT 10;

-- Recent orders
SELECT * FROM globalhub_orders.orders ORDER BY created_at DESC LIMIT 10;

-- Recent bookings
SELECT * FROM globalhub_hotels.hotel_bookings ORDER BY booked_at DESC LIMIT 10;
```

---

## ✅ Verification Checklist

Before starting services, verify:

- [ ] MySQL is installed and running
- [ ] Can login: `mysql -u root-pPassword@224`
- [ ] All 10 databases created
- [ ] Tables exist in each database
- [ ] MySQL connector in all pom.xml files
- [ ] All application.yml files updated
- [ ] Services build successfully

---

## 🎯 Next Steps

1. **Start MySQL** (if not already):
   ```bash
   sudo systemctl start mysql
   ```

2. **Run setup script**:
   ```bash
   ./setup-mysql.sh
   ```

3. **Build services**:
   ```bash
   mvn clean install -DskipTests
   ```

4. **Start all services**:
   ```bash
   ./build-and-run-all.sh
   ```

5. **Verify in Eureka**:
  Visit http://localhost:8761

6. **Test APIs**:
  Visit http://localhost:8084/swagger-ui.html (Product Service)

---

## 📞 Support Commands

### **Backup Database**
```bash
mysqldump -u root-pPassword@224 --all-databases > backup.sql
```

### **Restore Database**
```bash
mysql -u root-pPassword@224 < backup.sql
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

### **Optimize Tables**
```sql
OPTIMIZE TABLE globalhub_auth.users;
OPTIMIZE TABLE globalhub_products.products;
```

---

## 🎉 Success!

Your GlobalHub platform is now fully integrated with MySQL!

**All microservices are configured to:**
- ✅ Connect to MySQL automatically
- ✅ Auto-create tables using JPA/Hibernate
- ✅ Persist all data to MySQL databases
- ✅ Query data efficiently with indexes
- ✅ Handle transactions properly

**Ready to handle:**
- User registrations
- Vendor onboarding
- Product listings
- Hotel bookings
- Property sales
- Tour packages
- Order processing
- Payment transactions

**Just need to:**
1. Start MySQL
2. Run the setup script
3. Build and start services

---

*MySQL Integration Complete!* 🐬✅

*Documentation: MYSQL_SETUP_GUIDE.md*
