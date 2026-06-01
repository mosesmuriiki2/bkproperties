# BK Properties - Complete Setup Guide

## 🏘️ Overview

This guide will help you set up BK Properties - a property-focused marketplace for Kenya and Africa.

## 📋 What's Included

### Backend Services (Only Property-Related)
- ✅ Eureka Service Discovery
- ✅ API Gateway
- ✅ Auth Service
- ✅ Property Service
- ✅ Vendor Service

### Frontend
- ✅ Property listings and search
- ✅ Property details with booking
- ✅ Vendor portal for property management
- ✅ Admin dashboard
- ✅ Consumer dashboard
- ✅ Blog section
- ✅ Contact information

### Removed Services
- ❌ Hotel Service
- ❌ Tour Service
- ❌ Product Service
- ❌ Payment Service (can be added later)

## 🚀 Quick Setup

### Step 1: Remove Git History and Create New Structure

```bash
chmod +x create-bkproperties.sh
bash create-bkproperties.sh
```

This will:
- Remove .git directory
- Create bkproperties/ folder
- Copy only necessary backend services
- Copy frontend
- Copy Docker configuration

### Step 2: Rebrand to BK Properties

```bash
cd bkproperties
chmod +x rebrand-to-bkproperties.sh
bash rebrand-to-bkproperties.sh
```

This will:
- Update all branding to "BK Properties"
- Change colors to black, white, and green
- Update contact information
- Create new home page design
- Update SEO for property focus

### Step 3: Replace Home Page

```bash
# Copy the new home page
cp ../frontend-new-home-page.jsx frontend/src/pages/Home.jsx
```

### Step 4: Build and Deploy

```bash
# Build backend services
bash build-all-services.sh

# Build and start with Docker
bash docker-quick-start.sh
```

## 🎨 Brand Identity

### Colors
- **Primary Green**: #16a34a (green-600)
- **Secondary Black**: #000000
- **Accent Green**: #22c55e (green-500)
- **White**: #ffffff
- **Gray**: #6b7280

### Logo
🏘️ (House Buildings Emoji)

### Tagline
"Your Trusted Property Partner in Kenya & Africa"

## 📞 Contact Information

- **Phone**: +254 720 321107
- **WhatsApp**: +254 720 321107
- **Email**: info@bkproperties.co.ke
- **Website**: https://bkproperties.co.ke

## 🌐 Social Media

- Facebook: https://facebook.com/bkproperties
- Twitter: https://twitter.com/bkproperties
- Instagram: https://instagram.com/bkproperties
- LinkedIn: https://linkedin.com/company/bkproperties
- YouTube: https://youtube.com/@bkproperties

## 📁 Project Structure

```
bkproperties/
├── frontend/                          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # New redesigned home page
│   │   │   ├── Properties.jsx        # Property listings
│   │   │   ├── PropertyDetail.jsx    # Property details
│   │   │   ├── VendorDashboard.jsx   # Vendor management
│   │   │   └── AdminDashboard.jsx    # Admin panel
│   │   ├── config/
│   │   │   └── branding.js           # BK Properties branding
│   │   └── contexts/
│   │       └── BrandingContext.jsx   # Branding context
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── globalhub-eureka/             # Service discovery
│   ├── globalhub-gateway/            # API Gateway
│   ├── globalhub-auth-service/       # Authentication
│   ├── globalhub-property-service/   # Property management
│   └── globalhub-vendor-service/     # Vendor management
├── docker-compose.yml
├── build-all-services.sh
├── docker-quick-start.sh
└── README.md
```

## 🔧 Configuration

### Environment Variables

Update `docker-compose.yml` if needed:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/globalhub
  SPRING_DATASOURCE_USERNAME: root
  SPRING_DATASOURCE_PASSWORD: Password@224
```

### Frontend Configuration

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:9096/api
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

## 🌍 Access Points

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:9096
- **Eureka Dashboard**: http://localhost:8761
- **MySQL**: localhost:3306

## 👤 Default Credentials

**Super Admin:**
- Email: superadmin@gmail.com
- Password: admin@123

**Database:**
- Host: localhost:3306
- Database: globalhub
- Username: root
- Password: Password@224

## 📝 Initialize New Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial BK Properties setup"

# Add your remote repository
git remote add origin <your-repo-url>

# Push to main branch
git branch -M main
git push -u origin main
```

## 🎯 Features

### Property Listings
- Houses for sale
- Houses for rent
- Land for sale
- Apartments for rent
- Commercial properties
- Lease properties

### Search & Filter
- Location-based search
- Price range filter
- Property type filter
- Bedrooms/bathrooms filter
- Area size filter

### Vendor Portal
- Add/edit properties
- Manage availability calendar
- View bookings
- Handle inquiries
- Analytics dashboard

### Admin Dashboard
- Approve/reject properties
- Manage vendors
- View all bookings
- System analytics

### Consumer Features
- Browse properties
- Schedule viewings
- Send inquiries
- Save favorites
- View booking history

## 📱 SEO Optimization

The platform is optimized for:
- Property for sale Kenya
- Houses for rent Kenya
- Land for sale Kenya
- Real estate Kenya
- Property marketplace Kenya
- BK Properties

## 🔒 Security

- JWT authentication
- Role-based access control
- CORS configuration
- Input validation
- SQL injection prevention

## 📊 Monitoring

### Health Checks

```bash
# Check all services
docker-compose ps

# Check specific service
curl http://localhost:9096/actuator/health
```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f gateway
```

## 🆘 Troubleshooting

### Services Not Starting

```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild
docker-compose up -d --build [service-name]
```

### Database Connection Issues

```bash
# Check MySQL
docker-compose ps mysql

# Restart MySQL
docker-compose restart mysql
```

### Port Conflicts

```bash
# Find process using port
sudo lsof -i :9096

# Change port in docker-compose.yml
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Guide](https://spring.io/guides)
- [React Documentation](https://react.dev/)

## 📄 License

Proprietary - All rights reserved © 2026 BK Properties

## 📧 Support

For support, email info@bkproperties.co.ke or call +254 720 321107
