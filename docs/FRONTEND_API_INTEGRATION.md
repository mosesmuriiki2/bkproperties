# Frontend API Integration Guide

## 🎯 Overview

The frontend currently uses hardcoded mock data. This guide shows how to replace mock data with real API calls using the `apiClient.js`.

---

## 📋 Current Issues

### Hotels.jsx Example
```javascript
// ❌ CURRENT: Hardcoded mock data
const hotels = [
  {
    id: 1, 
    name: "Voyager Hotel", 
    location: "Nairobi, Kenya",
    // ... more hardcoded data
  },
  // ... more hotels
];
```

### What We Need
```javascript
// ✅ DESIRED: API calls
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchHotels = async () => {
    try {
      const data = await api.hotels.getAll();
      setHotels(data);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchHotels();
}, []);
```

---

## 🔄 Integration Pattern

### Step 1: Import API Client
```javascript
import api from '@/api/apiClient';
```

### Step 2: Set Up State
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### Step 3: Fetch Data in useEffect
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.{service}.{method}();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Step 4: Handle Loading/Error States
```javascript
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
  <div>
    {data.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
);
```

---

## 📝 Page-by-Page Integration

### 1. Hotels.jsx

**Current**: Hardcoded hotel array
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await api.hotels.getAll();
      setHotels(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const results = await api.hotels.search(searchCriteria);
      setHotels(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading hotels...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleSearch}>
        {/* ... search inputs ... */}
      </form>

      {/* Hotels grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <div key={hotel.id} className="hotel-card">
            <h3>{hotel.name}</h3>
            <p>{hotel.location}</p>
            <p>${hotel.priceFrom}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. Cars.jsx

**Current**: Hardcoded cars array
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'cars',
    minPrice: 0,
    maxPrice: 1000000
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll(filters);
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading cars...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Filter section */}
      <div className="filters">
        {/* ... filter controls ... */}
      </div>

      {/* Cars grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p>${car.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 3. Properties.jsx

**Current**: Hardcoded properties array
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await api.properties.getAll();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="property-card">
            <img src={property.image} alt={property.title} />
            <h3>{property.title}</h3>
            <p>{property.location}</p>
            <p className="text-lg font-bold">${property.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. Tours.jsx

**Current**: Hardcoded tours array
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function Tours() {
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
      setTours(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => (
          <div key={tour.id} className="tour-card">
            <h3>{tour.name}</h3>
            <p>{tour.destination}</p>
            <p>{tour.durationDays} days</p>
            <p className="text-lg font-bold">${tour.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. VendorDashboard.jsx

**Current**: Hardcoded vendor data
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function VendorDashboard() {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Fetch vendor info
      const vendorData = await api.vendors.getById(user.vendorId);
      setVendor(vendorData);
      
      // Fetch vendor products
      const productsData = await api.vendors.getProducts(user.vendorId);
      setProducts(productsData);
      
      // Fetch analytics
      const analyticsData = await api.vendors.getAnalytics(user.vendorId);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Vendor info */}
      {vendor && (
        <div className="vendor-info">
          <h2>{vendor.businessName}</h2>
          <p>{vendor.businessType}</p>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <div className="analytics">
          <p>Total Sales: ${analytics.totalSales}</p>
          <p>Orders: {analytics.totalOrders}</p>
        </div>
      )}

      {/* Products */}
      <div className="products">
        <h3>Your Products</h3>
        {products.map(product => (
          <div key={product.id}>
            <h4>{product.name}</h4>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 6. AdminDashboard.jsx

**Current**: Hardcoded admin data
**Change to**:

```javascript
import { useState, useEffect } from "react";
import api from "@/api/apiClient";

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const vendorsData = await api.vendors.getAll();
      setVendors(vendorsData);
      
      // Fetch platform stats (if endpoint exists)
      // const statsData = await api.admin.getStats();
      // setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorApproval = async (vendorId) => {
    try {
      await api.vendors.updateStatus(vendorId, 'APPROVED');
      fetchAdminData(); // Refresh data
    } catch (err) {
      console.error('Failed to approve vendor:', err);
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      {/* Vendors management */}
      <div className="vendors-section">
        <h3>Pending Vendors</h3>
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.businessName}</td>
                <td>{vendor.businessType}</td>
                <td>{vendor.status}</td>
                <td>
                  {vendor.status === 'PENDING' && (
                    <button onClick={() => handleVendorApproval(vendor.id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🔐 Authentication Integration

### Login Page

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.auth.login({ email, password });
      
      // Token is automatically stored by apiClient
      // Redirect based on role
      if (response.role === 'VENDOR') {
        navigate('/vendor-dashboard');
      } else if (response.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🛒 Shopping Cart Integration

```javascript
import { useState } from "react";
import api from "@/api/apiClient";

export default function Checkout({ cartItems }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Create order
      const order = await api.orders.create({
        items: cartItems,
        total: calculateTotal(cartItems)
      });

      // Process payment
      const payment = await api.payments.process({
        orderId: order.id,
        amount: order.total,
        paymentMethod: 'CARD'
      });

      if (payment.status === 'COMPLETED') {
        alert('Order placed successfully!');
        // Clear cart and redirect
        window.location.href = `/order/${order.id}`;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCheckout} disabled={processing}>
        {processing ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  );
}
```

---

## 🧪 Testing API Integration

### Test in Browser Console

```javascript
// Import the API client
import api from './api/apiClient';

// Test login
await api.auth.login({
  email: 'test@example.com',
  password: 'password123'
});

// Test getting hotels
const hotels = await api.hotels.getAll();
console.log('Hotels:', hotels);

// Test getting products
const products = await api.products.getAll({ category: 'cars' });
console.log('Products:', products);
```

---

## ✅ Integration Checklist

- [ ] Update Hotels.jsx to use api.hotels
- [ ] Update Cars.jsx to use api.products
- [ ] Update Properties.jsx to use api.properties
- [ ] Update Tours.jsx to use api.tours
- [ ] Update Land.jsx to use api.properties
- [ ] Update VendorDashboard.jsx to use api.vendors
- [ ] Update AdminDashboard.jsx to use api.vendors
- [ ] Update Login page to use api.auth
- [ ] Update Register page to use api.auth
- [ ] Update Checkout to use api.orders and api.payments
- [ ] Test all pages with real API
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Test authentication flow

---

## 🚀 Next Steps

1. Start with one page (e.g., Hotels.jsx)
2. Replace mock data with API calls
3. Test thoroughly
4. Move to next page
5. Repeat until all pages are integrated

---

*Frontend API Integration Guide | GlobalHub 2026*
