# Developer Quick Reference Guide

## Quick Start

### Start Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Start Backend
```bash
cd backend
./build-and-run-all.sh
# Eureka: http://localhost:7070
# Gateway: http://localhost:7071
# Services: 7072-7076
```

## Key Files

### Authentication
- `src/lib/AuthContext.jsx` - Auth state management
- `src/pages/Login.jsx` - Login page
- `src/pages/Register.jsx` - Registration page
- `src/components/ProtectedRoute.jsx` - Route protection

### Routing
- `src/App.jsx` - Main routing configuration
- `src/pages.config.js` - Page registration
- `src/Layout.jsx` - Navigation and layout

### API
- `src/api/apiClient.js` - API client with JWT support

### Dashboards
- `src/pages/ConsumerDashboard.jsx` - Consumer dashboard
- `src/pages/VendorDashboard.jsx` - Vendor dashboard
- `src/pages/AdminDashboard.jsx` - Admin dashboard

## Common Tasks

### Add a New Page
1. Create file in `src/pages/YourPage.jsx`
2. Export default component
3. Page is auto-registered in pages.config.js
4. Add route in App.jsx if needed

### Add Protected Route
```jsx
<Route
  path="/your-route"
  element={
    <ProtectedRoute requiredRole="CONSUMER">
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

### Make API Call
```jsx
import api from '@/api/apiClient';

// Login
const response = await api.auth.login({ email, password });

// Get hotels
const hotels = await api.hotels.getAll();

// Create product
const product = await api.products.create(productData);
```

### Access User Info
```jsx
import { useAuth } from '@/lib/AuthContext';

const { user, isAuthenticated, logout } = useAuth();
```

### Check User Role
```jsx
const user = JSON.parse(localStorage.getItem('user'));
if (user.role === 'VENDOR') {
  // Vendor-specific code
}
```

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/validate
```

### Users
```
GET /api/users/{userId}
PUT /api/users/{userId}
GET /api/users/{userId}/addresses
POST /api/users/{userId}/addresses
GET /api/users/{userId}/orders
```

### Vendors
```
POST /api/vendors/register
GET /api/vendors
GET /api/vendors/{vendorId}
GET /api/vendors/{vendorId}/products
GET /api/vendors/{vendorId}/analytics
```

### Products
```
GET /api/products
GET /api/products/{productId}
POST /api/products
PUT /api/products/{productId}
DELETE /api/products/{productId}
GET /api/products/search
GET /api/products/categories
```

### Hotels
```
GET /api/hotels
GET /api/hotels/{hotelId}
POST /api/hotels/search
GET /api/hotels/{hotelId}/rooms
GET /api/hotels/{hotelId}/availability
POST /api/hotels/bookings
```

## User Roles

### CONSUMER
- Browse marketplace
- Make bookings
- View order history
- Manage profile
- Access: `/consumer-dashboard`

### VENDOR
- Manage products
- View orders
- Track sales
- Manage inventory
- Access: `/vendor-dashboard`

### ADMIN
- Manage users
- Approve vendors
- View analytics
- System oversight
- Access: `/admin-dashboard`

## localStorage Keys

```javascript
// Access token for API requests
localStorage.getItem('accessToken')

// User information
localStorage.getItem('user')
// {
//   id: "uuid",
//   email: "user@example.com",
//   firstName: "John",
//   lastName: "Doe",
//   role: "CONSUMER"
// }
```

## Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  try {
    setLoading(true);
    const result = await api.someEndpoint();
    // Handle success
  } catch (err) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### Error Handling
```jsx
const [error, setError] = useState("");

try {
  // API call
} catch (err) {
  setError(err.message || "An error occurred");
}
```

### Redirect After Login
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/consumer-dashboard');
```

### Check Authentication
```jsx
const user = localStorage.getItem('user');
if (!user) {
  navigate('/login');
}
```

## Debugging

### Check Token
```javascript
// In browser console
localStorage.getItem('accessToken')
```

### Check User Info
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Look for API requests
4. Check Authorization header

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check stack traces

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Eureka | 7070 | http://localhost:7070 |
| Gateway | 7071 | http://localhost:7071 |
| Auth | 7072 | http://localhost:7072 |
| User | 7073 | http://localhost:7073 |
| Vendor | 7074 | http://localhost:7074 |
| Product | 7075 | http://localhost:7075 |
| Hotel | 7076 | http://localhost:7076 |

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:7071
```

### Backend (application.yml)
```yaml
server:
  port: 7072
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:7070/eureka/
```

## Testing Credentials

```
Consumer:
- Email: consumer@example.com
- Password: password

Vendor:
- Email: vendor@example.com
- Password: password

Admin:
- Email: admin@example.com
- Password: password
```

## Useful Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Backend
```bash
cd backend
./build-and-run-all.sh    # Build and run all services
docker-compose up -d      # Run with Docker
docker-compose down       # Stop services
```

## Component Library

### Buttons
```jsx
import { Button } from "@/components/ui/button";

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
```

### Input
```jsx
import { Input } from "@/components/ui/input";

<Input type="email" placeholder="Email" />
```

### Select
```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Dropdown Menu
```jsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Icons

```jsx
import { Home, User, LogOut, Settings, Search } from "lucide-react";

<Home className="w-5 h-5" />
```

## Styling

### Tailwind Classes
```jsx
// Spacing
className="p-4 m-2 px-3 py-2"

// Colors
className="bg-blue-600 text-white border-gray-200"

// Responsive
className="md:flex lg:grid"

// Hover/Active
className="hover:bg-gray-50 active:bg-gray-100"
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token in localStorage, login again |
| CORS Error | Check Gateway CORS config |
| API not found | Check service is running on correct port |
| Page not loading | Check route in App.jsx |
| Token not sent | Check getAuthHeaders() in apiClient.js |
| Wrong dashboard | Check role in localStorage |

## Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [JWT.io](https://jwt.io)

## Getting Help

1. Check documentation files
2. Review code comments
3. Check browser console
4. Check backend logs
5. Ask team members

---

**Last Updated**: March 10, 2026
