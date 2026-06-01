/**
 * API Client for GlobalHub Backend
 * 
 * This file provides functions to interact with the Spring Boot microservices
 * through the API Gateway.
 * 
 * Usage:
 *   import api from './apiClient';
 *   
 *   // Login
 *   const response = await api.auth.login({ email, password });
 *   
 *   // Get products
 *   const products = await api.products.getAll();
 */

// Use relative path - Vite proxy will handle routing to gateway
const API_BASE_URL = '/api';

// Module status cache
let moduleStatus = null;

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Handle response errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    
    if (response.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Check if a module is enabled
const isModuleEnabled = async (moduleName) => {
  if (!moduleStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`);
      const data = await response.json();
      moduleStatus = data.modules || {};
    } catch (error) {
      console.warn('Could not fetch module status:', error);
      moduleStatus = {};
    }
  }
  return moduleStatus[moduleName] === true;
};

export const api = {
  // ==================== AUTHENTICATION ====================
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },

    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(response);
      
      // Store tokens
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          email: data.email,
          role: data.role
        }));
      }
      
      return data;
    },

    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    },

    refreshToken: async (refreshToken) => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await handleResponse(response);
      
      // Update stored token
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      
      return data;
    },

    validateToken: async (token) => {
      const response = await fetch(`${API_BASE_URL}/auth/validate?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    sendOTP: async (email) => {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    },

    verifyOTP: async (email, otp) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await handleResponse(response);
      
      // Store tokens
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          email: data.email,
          role: data.role
        }));
      }
      
      return data;
    },
  },

  // ==================== USERS ====================
  users: {
    getProfile: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    updateProfile: async (userId, userData) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },

    getAddresses: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/addresses`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    addAddress: async (userId, addressData) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressData),
      });
      return handleResponse(response);
    },

    getOrders: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== VENDORS ====================
  vendors: {
    register: async (vendorData) => {
      const response = await fetch(`${API_BASE_URL}/vendors/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vendorData),
      });
      return handleResponse(response);
    },

    getAll: async (page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/vendors?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByUserId: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/vendors/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getProducts: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/products`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getAnalytics: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/analytics`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    approve: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    reject: async (vendorId, reason) => {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/reject?reason=${encodeURIComponent(reason || '')}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== PRODUCTS ====================
  products: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/products${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (productId) => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    create: async (productData) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(response);
    },

    update: async (productId, productData) => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return handleResponse(response);
    },

    delete: async (productId) => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    search: async (query) => {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getCategories: async () => {
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== HOTELS ====================
  hotels: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/hotels${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (hotelId) => {
      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    search: async (criteria) => {
      const response = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      return handleResponse(response);
    },

    getRooms: async (hotelId) => {
      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    checkAvailability: async (hotelId, params) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/availability?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    book: async (bookingData) => {
      const response = await fetch(`${API_BASE_URL}/hotels/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    },
  },

  // ==================== PROPERTIES ====================
  properties: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/properties${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getLand: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/properties/land${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (propertyId) => {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByVendor: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/properties/vendor/${vendorId}?page=0&size=100`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getPending: async (page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/properties/pending?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getActive: async (page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/properties/active?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    approve: async (propertyId) => {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    reject: async (propertyId, reason) => {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/reject?reason=${encodeURIComponent(reason || '')}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    create: async (propertyData, images) => {
      const formData = new FormData();
      
      // Create a Blob with the correct content type for the property JSON
      const propertyBlob = new Blob([JSON.stringify(propertyData)], { 
        type: 'application/json' 
      });
      formData.append('property', propertyBlob);
      
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const token = sessionStorage.getItem('token') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          // Don't set Content-Type - let browser set it with boundary for multipart/form-data
        },
        body: formData,
      });
      return handleResponse(response);
    },

    update: async (propertyId, propertyData, images) => {
      const formData = new FormData();
      
      const propertyBlob = new Blob([JSON.stringify(propertyData)], { 
        type: 'application/json' 
      });
      formData.append('property', propertyBlob);
      
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const token = sessionStorage.getItem('token') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
      });
      return handleResponse(response);
    },

    changeStatus: async (propertyId, status) => {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    delete: async (propertyId) => {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      return true;
    },

    search: async (criteria) => {
      const response = await fetch(`${API_BASE_URL}/properties/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      return handleResponse(response);
    },
  },

  // ==================== TOURS ====================
  tours: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/tours${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (tourId) => {
      const response = await fetch(`${API_BASE_URL}/tours/${tourId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getVehicles: async () => {
      const response = await fetch(`${API_BASE_URL}/tours/vehicles`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    search: async (criteria) => {
      const response = await fetch(`${API_BASE_URL}/tours/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      return handleResponse(response);
    },

    book: async (bookingData) => {
      const response = await fetch(`${API_BASE_URL}/tours/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    },
  },

  // ==================== ORDERS ====================
  orders: {
    create: async (orderData) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return handleResponse(response);
    },

    getById: async (orderId) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByUser: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    updateStatus: async (orderId, status) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
  },

  // ==================== PAYMENTS ====================
  payments: {
    process: async (paymentData) => {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      return handleResponse(response);
    },

    getById: async (paymentId) => {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByOrder: async (orderId) => {
      const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    refund: async (paymentId, refundData) => {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundData),
      });
      return handleResponse(response);
    },
  },

  // ==================== INQUIRIES ====================
  inquiries: {
    create: async (inquiryData) => {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      return handleResponse(response);
    },

    getByVendor: async (vendorId, page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/vendor/${vendorId}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByVendorAndStatus: async (vendorId, status, page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/vendor/${vendorId}/status/${status}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getAll: async (page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/inquiries?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByStatus: async (status, page = 0, size = 50) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/status/${status}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getById: async (inquiryId) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    markAsRead: async (inquiryId) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    updateStatus: async (inquiryId, status) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    countNewForVendor: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/vendor/${vendorId}/count/new`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    countNew: async () => {
      const response = await fetch(`${API_BASE_URL}/inquiries/count/new`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== BOOKINGS ====================
  bookings: {
    create: async (bookingData) => {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    },

    getByVendor: async (vendorId, page = 0, size = 20) => {
      const response = await fetch(`${API_BASE_URL}/bookings/vendor/${vendorId}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getUpcomingByVendor: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/vendor/${vendorId}/upcoming`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    countNewForVendor: async (vendorId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/vendor/${vendorId}/count/new`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByCustomer: async (customerId, page = 0, size = 20) => {
      const response = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getUpcomingByCustomer: async (customerId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}/upcoming`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    confirm: async (bookingId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    cancel: async (bookingId, reason) => {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason || '')}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    complete: async (bookingId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    markNotified: async (bookingId) => {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/notify`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== AVAILABILITY ====================
  availability: {
    create: async (availabilityData) => {
      const response = await fetch(`${API_BASE_URL}/availability`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(availabilityData),
      });
      return handleResponse(response);
    },

    update: async (availabilityId, availabilityData) => {
      const response = await fetch(`${API_BASE_URL}/availability/${availabilityId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(availabilityData),
      });
      return handleResponse(response);
    },

    delete: async (availabilityId) => {
      const response = await fetch(`${API_BASE_URL}/availability/${availabilityId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to delete availability');
      }
      return true;
    },

    getByVendor: async (vendorId, fromDate) => {
      const params = fromDate ? `?fromDate=${fromDate}` : '';
      const response = await fetch(`${API_BASE_URL}/availability/vendor/${vendorId}${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getByProperty: async (propertyId, fromDate) => {
      const params = fromDate ? `?fromDate=${fromDate}` : '';
      const response = await fetch(`${API_BASE_URL}/availability/property/${propertyId}${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    getAvailableSlots: async (propertyId) => {
      const response = await fetch(`${API_BASE_URL}/availability/property/${propertyId}/available`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },

  // ==================== MODULES ====================
  modules: {
    getStatus: async () => {
      const response = await fetch(`${API_BASE_URL}/modules`);
      return handleResponse(response);
    },

    getDetails: async () => {
      const response = await fetch(`${API_BASE_URL}/modules/status`);
      return handleResponse(response);
    },

    isEnabled: isModuleEnabled,
  },
};

export default api;
export { isModuleEnabled };