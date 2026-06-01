# Frontend Integration Guide

## Overview
This guide shows how to integrate frontend pages with the GlobalHub API using the `apiClient.js`.

## Pattern for API Integration

### 1. Import API Client
```javascript
import api from "@/api/apiClient";
```

### 2. Add State Management
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3. Fetch Data on Mount
```javascript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const result = await api.endpoint.method();
    setData(result);
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Handle Loading/Error States
```javascript
{loading && <p>Loading...</p>}
{error && <p className="text-red-500">Error: {error}</p>}
{!loading && !error && (
  // Render data
)}
```

## Page-Specific Integration

### Hotels.jsx ✅ COMPLETE
**Status**: Fully integrated with API
- Fetches hotels from `api.hotels.getAll()`
- Supports filtering by location and price
- Booking integration with `api.hotels.book()`
- Loading and error states implemented

### Cars.jsx (Tours) - NEEDS INTEGRATION
**API Endpoints to Use**:
```javascript
// Get all tours/vehicles
const tours = await api.tours.getAll();

// Get specific tour
const tour = await api.tours.getById(tourId);

// Search tours
const results = await api.tours.search(criteria);

// Get available vehicles
const vehicles = await api.tours.getVehicles();

// Create booking
const booking = await api.tours.book(bookingData);
```

**Implementation Pattern**:
```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function Cars() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await api.tours.getAll();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

### Properties.jsx - NEEDS INTEGRATION
**API Endpoints to Use**:
```javascript
// Get all properties
const properties = await api.properties.getAll();

// Get specific property
const property = await api.properties.getById(propertyId);

// Search properties
const results = await api.properties.search(criteria);

// Get land properties
const land = await api.properties.getLand();
```

**Implementation Pattern**: Same as Cars.jsx, replace `api.tours` with `api.properties`

### Tours.jsx - NEEDS INTEGRATION
**API Endpoints to Use**:
```javascript
// Get all tours
const tours = await api.tours.getAll();

// Get specific tour
const tour = await api.tours.getById(tourId);

// Search tours
const results = await api.tours.search(criteria);

// Get vehicles
const vehicles = await api.tours.getVehicles();

// Create booking
const booking = await api.tours.book(bookingData);
```

### VendorDashboard.jsx - NEEDS INTEGRATION
**API Endpoints to Use**:
```javascript
// Get vendor info
const vendor = await api.vendors.getById(vendorId);

// Get vendor products
const products = await api.vendors.getProducts(vendorId);

// Get vendor analytics
const analytics = await api.vendors.getAnalytics(vendorId);

// Create product
const product = await api.products.create(productData);

// Update product
const updated = await api.products.update(productId, productData);

// Delete product
await api.products.delete(productId);
```

### AdminDashboard.jsx - NEEDS INTEGRATION
**API Endpoints to Use**:
```javascript
// Get all vendors
const vendors = await api.vendors.getAll();

// Get all products
const products = await api.products.getAll();

// Get all hotels
const hotels = await api.hotels.getAll();

// Get all tours
const tours = await api.tours.getAll();

// Update vendor status
await api.vendors.updateStatus(vendorId, status);
```

## Authentication Flow

### Login
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await api.auth.login({ email, password });
    // Token is automatically stored in localStorage
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
```

### Register
```javascript
const handleRegister = async (userData) => {
  try {
    const response = await api.auth.register(userData);
    // Token is automatically stored
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
```

### Logout
```javascript
const handleLogout = async () => {
  await api.auth.logout();
  navigate('/login');
};
```

### Token Refresh
```javascript
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.auth.refreshToken(refreshToken);
    // New token is automatically stored
  } catch (err) {
    // Redirect to login if refresh fails
    navigate('/login');
  }
};
```

## Error Handling

### Global Error Handler
```javascript
const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Redirect to login
    navigate('/login');
  } else if (error.message.includes('403')) {
    // Show permission denied
    setError('You do not have permission to perform this action');
  } else if (error.message.includes('404')) {
    // Show not found
    setError('Resource not found');
  } else {
    // Show generic error
    setError(error.message || 'An error occurred');
  }
};
```

## Data Mapping

### Hotel Data Structure
```javascript
{
  id: number,
  name: string,
  city: string,
  country: string,
  rating: number,
  pricePerNight: number,
  imageUrl: string,
  description: string,
  facilities: string[],
  rooms: [
    {
      id: number,
      type: string,
      pricePerNight: number,
      available: number
    }
  ]
}
```

### Tour Data Structure
```javascript
{
  id: number,
  name: string,
  destination: string,
  duration: number,
  pricePerPerson: number,
  imageUrl: string,
  description: string,
  vehicles: [
    {
      id: number,
      type: string,
      capacity: number,
      pricePerDay: number
    }
  ]
}
```

### Property Data Structure
```javascript
{
  id: number,
  title: string,
  location: string,
  price: number,
  imageUrl: string,
  description: string,
  bedrooms: number,
  bathrooms: number,
  area: number,
  type: string // 'APARTMENT', 'HOUSE', 'LAND', etc.
}
```

## Common Patterns

### Pagination
```javascript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const fetchData = async () => {
  const data = await api.endpoint.getAll({ 
    page, 
    pageSize 
  });
  setData(data);
};
```

### Filtering
```javascript
const [filters, setFilters] = useState({
  location: '',
  priceMin: 0,
  priceMax: 1000
});

const fetchData = async () => {
  const data = await api.endpoint.getAll(filters);
  setData(data);
};
```

### Search
```javascript
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = async () => {
  const results = await api.endpoint.search(searchQuery);
  setData(results);
};
```

## Testing API Integration

### Using Swagger UI
1. Navigate to `http://localhost:7071/swagger-ui.html` (Gateway)
2. Test endpoints directly from the UI
3. Copy the curl commands for reference

### Using cURL
```bash
# Get all hotels
curl http://localhost:7071/api/hotels \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create booking
curl -X POST http://localhost:7071/api/hotels/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "hotelId": 1,
    "roomId": 1,
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-17"
  }'
```

## Troubleshooting

### 401 Unauthorized
- Token has expired or is invalid
- Solution: Call `api.auth.refreshToken()` or redirect to login

### 403 Forbidden
- User doesn't have permission
- Solution: Check user role and permissions

### 404 Not Found
- Resource doesn't exist
- Solution: Verify the resource ID and endpoint

### 500 Server Error
- Backend error
- Solution: Check backend logs and error message

### CORS Error
- Frontend and backend have different origins
- Solution: Verify CORS configuration in backend

## Best Practices

1. **Always handle loading states** - Show spinners or skeleton loaders
2. **Always handle errors** - Display user-friendly error messages
3. **Use try-catch blocks** - Wrap API calls in error handling
4. **Store tokens securely** - Use localStorage (or sessionStorage for sensitive apps)
5. **Refresh tokens proactively** - Don't wait for 401 errors
6. **Validate user input** - Before sending to API
7. **Use TypeScript** - For better type safety (optional)
8. **Cache data when appropriate** - Reduce API calls
9. **Implement debouncing** - For search and filter operations
10. **Log errors** - For debugging and monitoring
