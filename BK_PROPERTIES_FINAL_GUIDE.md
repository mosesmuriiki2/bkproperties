# BK Properties - Final Setup Guide

## 🎯 Quick Setup (Recommended)

Run this single command to set up everything:

```bash
chmod +x setup-bkproperties-complete.sh
bash setup-bkproperties-complete.sh
```

This will:
- ✅ Remove .git history
- ✅ Rebrand to BK Properties
- ✅ Update all colors to black, white, green
- ✅ Add contact info (+254 720 321107)
- ✅ Remove non-property services
- ✅ Create new configuration

## 📋 What You Get

### ✅ Included Services
- Eureka (Service Discovery)
- Gateway (API Gateway)
- Auth Service (Authentication)
- Property Service (Property Management)
- Vendor Service (Vendor Management)

### ❌ Removed Services
- Hotel Service
- Tour Service
- Product Service
- Payment Service

### 🎨 New Design
- **Colors**: Black (#000000), White (#ffffff), Green (#16a34a)
- **Logo**: 🏘️ (House Buildings)
- **Focus**: Properties only (houses, land, apartments, commercial, rental, lease)

### 📞 Contact Information
- **Phone**: +254 720 321107
- **WhatsApp**: +254 720 321107
- **Email**: info@bkproperties.co.ke

### 🌐 Social Media
- Facebook: facebook.com/bkproperties
- Twitter: twitter.com/bkproperties
- Instagram: instagram.com/bkproperties
- LinkedIn: linkedin.com/company/bkproperties
- YouTube: youtube.com/@bkproperties

## 🏠 New Home Page Features

The new home page includes:

1. **Hero Section** - Search bar with property search
2. **Stats Section** - 5,000+ properties, 10,000+ clients
3. **Featured Properties** - Latest listings
4. **Why Choose Us** - 4 key features
5. **Blog Section** - Property insights and news
6. **Testimonials** - Client reviews
7. **Contact CTA** - Phone, email, social media

To use the new home page:

```bash
cp frontend-new-home-page.jsx frontend/src/pages/Home.jsx
```

## 🚀 Running the Application

### Option 1: Docker (Recommended)

```bash
# Build and start all services
bash docker-quick-start.sh

# Access at:
# Frontend: http://localhost
# Gateway: http://localhost:9096
# Eureka: http://localhost:8761
```

### Option 2: Manual

```bash
# Backend
cd backend
bash build-all-services.sh
bash restart-services.sh

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Initialize New Git Repository

```bash
# Remove old git (if not done)
rm -rf .git

# Initialize new repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial BK Properties setup - Property marketplace for Kenya"

# Add your remote
git remote add origin https://github.com/yourusername/bkproperties.git

# Push
git branch -M main
git push -u origin main
```

## 🎨 Customization

### Update Colors

Edit `frontend/src/config/branding.js`:

```javascript
colors: {
  primary: "#16a34a",    // Green
  secondary: "#000000",  // Black
  accent: "#22c55e",     // Light Green
  light: "#ffffff",      // White
}
```

### Update Contact Info

Edit `frontend/src/config/branding.js`:

```javascript
contact: {
  email: "info@bkproperties.co.ke",
  phone: "+254 720 321107",
  whatsapp: "+254720321107",
}
```

### Update Social Media

Edit `frontend/src/config/branding.js`:

```javascript
social: {
  facebook: "https://facebook.com/bkproperties",
  twitter: "https://twitter.com/bkproperties",
  // ... etc
}
```

## 📊 Features

### For Property Seekers
- Browse properties (houses, land, apartments)
- Advanced search and filters
- Schedule property viewings
- Send inquiries to vendors
- Save favorites
- View booking history

### For Vendors
- List properties
- Manage availability calendar
- Confirm bookings
- Handle inquiries
- View analytics
- Upload property images

### For Admins
- Approve/reject properties
- Manage vendors
- View all bookings
- System analytics
- User management

## 🌍 SEO Optimization

Optimized for keywords:
- Property for sale Kenya
- Houses for sale Kenya
- Land for sale Kenya
- Apartments for rent Kenya
- Real estate Kenya
- BK Properties
- Property Nairobi, Mombasa, Kisumu

## 🔒 Security

- JWT authentication
- Role-based access (Admin, Vendor, Consumer)
- CORS configuration
- Input validation
- Secure password hashing

## 📱 Responsive Design

- Mobile-first approach
- Works on all devices
- Touch-friendly interface
- Fast loading times

## 🐳 Docker Configuration

Services included in `docker-compose.yml`:
- MySQL database
- Eureka service discovery
- API Gateway
- Auth Service
- Property Service
- Vendor Service
- Frontend (Nginx)

## 📈 Monitoring

### Health Checks

```bash
# All services
docker-compose ps

# Specific service
curl http://localhost:9096/actuator/health
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Specific service
docker-compose logs -f property-service
```

## 🆘 Troubleshooting

### Services won't start

```bash
docker-compose down
docker-compose up -d --build
```

### Database connection error

```bash
docker-compose restart mysql
docker-compose logs mysql
```

### Port already in use

```bash
# Find process
sudo lsof -i :9096

# Kill process or change port in docker-compose.yml
```

## 📚 Documentation

- `COMPLETE_BKPROPERTIES_SETUP.md` - Detailed setup guide
- `DOCKER_DEPLOYMENT_GUIDE.md` - Docker deployment
- `README.md` - Quick reference

## 📞 Support

**BK Properties Support**
- Phone: +254 720 321107
- Email: info@bkproperties.co.ke
- WhatsApp: +254 720 321107

## 📄 License

Proprietary - All rights reserved © 2026 BK Properties

---

## ✅ Checklist

Before going live:

- [ ] Run setup script
- [ ] Copy new home page
- [ ] Test all features
- [ ] Update contact information
- [ ] Set up social media accounts
- [ ] Configure domain name
- [ ] Set up SSL certificate
- [ ] Configure email service
- [ ] Test on mobile devices
- [ ] Initialize git repository
- [ ] Push to remote repository
- [ ] Deploy to production server

---

**Ready to launch BK Properties!** 🏘️🚀
