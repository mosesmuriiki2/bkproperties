# NiaHubX Docker Deployment Guide

Complete guide for deploying NiaHubX property marketplace platform using Docker and Docker Compose.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Build Instructions](#build-instructions)
4. [Deployment](#deployment)
5. [Configuration](#configuration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

## 🔧 Prerequisites

### Required Software
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Java JDK**: 17 (for building backend services)
- **Maven**: 3.8+ (for building backend services)
- **Node.js**: 18+ (for building frontend)
- **Git**: For cloning the repository

### System Requirements
- **CPU**: 4 cores minimum (8 cores recommended)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 20GB free space minimum
- **OS**: Linux, macOS, or Windows with WSL2

### Verify Installation
```bash
docker --version
docker-compose --version
java -version
mvn -version
node --version
npm --version
```

## 📁 Project Structure

```
niahubx/
├── frontend/                          # React frontend
│   ├── Dockerfile                     # Frontend Docker image
│   ├── nginx.conf                     # Nginx configuration
│   └── src/                          # Source code
├── backend/                          # Spring Boot microservices
│   ├── globalhub-eureka/            # Service discovery
│   │   └── Dockerfile
│   ├── globalhub-gateway/           # API Gateway
│   │   └── Dockerfile
│   ├── globalhub-auth-service/      # Authentication
│   │   └── Dockerfile
│   ├── globalhub-property-service/  # Property management
│   │   └── Dockerfile
│   └── globalhub-vendor-service/    # Vendor management
│       └── Dockerfile
├── docker-compose.yml               # Docker Compose configuration
└── DOCKER_DEPLOYMENT_GUIDE.md      # This file
```

## 🏗️ Build Instructions

### Step 1: Build Backend Services

Build all Spring Boot services:

```bash
# Navigate to backend directory
cd backend

# Build Eureka Service
cd globalhub-eureka
mvn clean package -DskipTests
cd ..

# Build Gateway
cd globalhub-gateway
mvn clean package -DskipTests
cd ..

# Build Auth Service
cd globalhub-auth-service
mvn clean package -DskipTests
cd ..

# Build Property Service
cd globalhub-property-service
mvn clean package -DskipTests
cd ..

# Build Vendor Service
cd globalhub-vendor-service
mvn clean package -DskipTests
cd ..

# Return to root
cd ..
```

**Or use the build script:**

```bash
chmod +x build-all-services.sh
./build-all-services.sh
```

### Step 2: Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 3: Build Docker Images

Build all Docker images:

```bash
docker-compose build
```

Build specific service:

```bash
docker-compose build frontend
docker-compose build gateway
docker-compose build auth-service
```

## 🚀 Deployment

### Quick Start (Development)

Start all services:

```bash
docker-compose up -d
```

View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f gateway
docker-compose logs -f frontend
```

Check service status:

```bash
docker-compose ps
```

### Service Startup Order

Services start in this order (managed by Docker Compose):

1. **MySQL** (Database)
2. **Eureka** (Service Discovery)
3. **Auth Service** (Authentication)
4. **Property Service** (Property Management)
5. **Vendor Service** (Vendor Management)
6. **Gateway** (API Gateway)
7. **Frontend** (Web Application)

### Access the Application

Once all services are healthy:

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:9096
- **Eureka Dashboard**: http://localhost:8761
- **MySQL**: localhost:3306

### Default Credentials

**Super Admin:**
- Email: `superadmin@gmail.com`
- Password: `admin@123`

**Database:**
- Host: `localhost:3306`
- Database: `globalhub`
- Username: `root`
- Password: `Password@224`

## ⚙️ Configuration

### Environment Variables

Each service can be configured via environment variables in `docker-compose.yml`:

#### MySQL Configuration
```yaml
MYSQL_ROOT_PASSWORD: Password@224
MYSQL_DATABASE: globalhub
MYSQL_USER: niahubx
MYSQL_PASSWORD: NiaHubX@2024
```

#### Spring Boot Services
```yaml
SPRING_PROFILES_ACTIVE: docker
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/globalhub
SPRING_DATASOURCE_USERNAME: root
SPRING_DATASOURCE_PASSWORD: Password@224
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka:8761/eureka/
```

#### JWT Configuration
```yaml
JWT_SECRET: NiaHubXSecretKey2024ForJWTTokenGenerationAndValidation
```

### Volumes

Persistent data is stored in Docker volumes:

- `mysql-data`: Database data
- `property-uploads`: Property images and documents
- `vendor-uploads`: Vendor documents

View volumes:
```bash
docker volume ls
```

Backup volumes:
```bash
docker run --rm -v mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data
```

### Networking

All services communicate via the `niahubx-network` bridge network.

View network:
```bash
docker network inspect niahubx-network
```

## 📊 Monitoring

### Health Checks

All services have health checks configured. Check health status:

```bash
# All services
docker-compose ps

# Specific service health
docker inspect --format='{{.State.Health.Status}}' niahubx-gateway
```

### Service Endpoints

Health check endpoints:

- Eureka: http://localhost:8761/actuator/health
- Gateway: http://localhost:9096/actuator/health
- Auth Service: http://localhost:8081/actuator/health
- Property Service: http://localhost:7086/actuator/health
- Vendor Service: http://localhost:8084/actuator/health

### Logs

View logs for debugging:

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f gateway

# Save logs to file
docker-compose logs > niahubx-logs.txt
```

### Resource Usage

Monitor resource consumption:

```bash
docker stats
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Services Not Starting

**Problem**: Services fail to start or crash immediately.

**Solution**:
```bash
# Check logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build [service-name]
```

#### 2. Database Connection Errors

**Problem**: Services can't connect to MySQL.

**Solution**:
```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify database exists
docker-compose exec mysql mysql -uroot -pPassword@224 -e "SHOW DATABASES;"

# Restart MySQL
docker-compose restart mysql
```

#### 3. Port Conflicts

**Problem**: Port already in use.

**Solution**:
```bash
# Find process using port
sudo lsof -i :9096
sudo lsof -i :3306

# Kill process or change port in docker-compose.yml
```

#### 4. Out of Memory

**Problem**: Services crash due to memory issues.

**Solution**:
```bash
# Increase Docker memory limit
# Docker Desktop: Settings > Resources > Memory

# Reduce JVM memory in docker-compose.yml
JAVA_OPTS: "-Xms256m -Xmx512m"
```

#### 5. Frontend Can't Reach Backend

**Problem**: API calls fail from frontend.

**Solution**:
- Check gateway is running: `docker-compose ps gateway`
- Verify nginx proxy configuration in `frontend/nginx.conf`
- Check CORS settings in gateway

### Reset Everything

Complete reset (⚠️ **WARNING**: Deletes all data):

```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean build and restart
docker-compose up -d --build
```

### Debug Mode

Run services in foreground for debugging:

```bash
# Stop background services
docker-compose down

# Run in foreground
docker-compose up
```

## 🌐 Production Deployment

### Pre-Production Checklist

- [ ] Change all default passwords
- [ ] Configure SSL/TLS certificates
- [ ] Set up proper logging and monitoring
- [ ] Configure backup strategy
- [ ] Set resource limits
- [ ] Enable security scanning
- [ ] Configure firewall rules
- [ ] Set up load balancing (if needed)

### Production Configuration

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - /data/mysql:/var/lib/mysql
    restart: always

  gateway:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      JWT_SECRET: ${JWT_SECRET}
    restart: always

  frontend:
    environment:
      NODE_ENV: production
    restart: always
```

Deploy to production:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### SSL/TLS Configuration

Add SSL certificate to nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name niahubx.co.ke;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of configuration
}
```

### Backup Strategy

Automated backup script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup MySQL
docker-compose exec -T mysql mysqldump -uroot -pPassword@224 globalhub > $BACKUP_DIR/db_$DATE.sql

# Backup volumes
docker run --rm -v mysql-data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/mysql_$DATE.tar.gz /data
docker run --rm -v property-uploads:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/uploads_$DATE.tar.gz /data

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup.sh
```

### Monitoring with Prometheus

Add Prometheus and Grafana:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
```

### Scaling Services

Scale specific services:

```bash
# Scale property service to 3 instances
docker-compose up -d --scale property-service=3

# Scale vendor service to 2 instances
docker-compose up -d --scale vendor-service=2
```

## 📝 Maintenance

### Update Services

```bash
# Pull latest code
git pull

# Rebuild services
docker-compose build

# Restart with new images
docker-compose up -d
```

### Clean Up

Remove unused images and containers:

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

## 🆘 Support

### Useful Commands

```bash
# View all containers
docker ps -a

# View all images
docker images

# View all volumes
docker volume ls

# View all networks
docker network ls

# Execute command in container
docker-compose exec gateway bash

# Copy files from container
docker cp niahubx-gateway:/app/logs ./logs

# View container details
docker inspect niahubx-gateway
```

### Getting Help

1. Check logs: `docker-compose logs [service]`
2. Check health: `docker-compose ps`
3. Review documentation in `docs/` folder
4. Check GitHub issues
5. Contact support: info@niahubx.co.ke

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Nginx Docker Guide](https://hub.docker.com/_/nginx)

## 📄 License

Proprietary - All rights reserved © 2026 NiaHubX
