# Admin Dashboard Enhancements - Implementation Status

## ✅ Completed

### Backend - Property Service
1. **Added GET /api/properties** - Get ALL properties with pagination and status filter
2. **Added PUT /api/properties/{id}/status** - Change property status (ACTIVE, DRAFT, INACTIVE)
3. **Added PropertyService.getAllProperties()** - Service method to get all properties
4. **Added PropertyService.changePropertyStatus()** - Service method to change status
5. **Existing: PUT /api/properties/{id}** - Update property details
6. **Existing: DELETE /api/properties/{id}** - Delete property

### Frontend - API Client
1. **Added properties.update()** - Update property with images
2. **Added properties.changeStatus()** - Change property status
3. **Added properties.delete()** - Delete property
4. **Existing: properties.getAll()** - Get all properties
5. **Existing: properties.approve()** - Approve property
6. **Existing: properties.reject()** - Reject property

## 🔄 In Progress / To Do

### Backend - User Management (Auth Service)
Need to add these endpoints to AuthController:

```java
@GetMapping("/users")
public ResponseEntity<Page<UserDTO>> getAllUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    // Get all users with pagination
}

@PostMapping("/users")
public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
    // Create new user with role
}

@PutMapping("/users/{id}")
public ResponseEntity<UserDTO> updateUser(
    @PathVariable Long id,
    @RequestBody UpdateUserRequest request) {
    // Update user details
}

@PutMapping("/users/{id}/status")
public ResponseEntity<UserDTO> updateUserStatus(
    @PathVariable Long id,
    @RequestParam boolean active) {
    // Activate/deactivate user
}

@PutMapping("/users/{id}/role")
public ResponseEntity<UserDTO> updateUserRole(
    @PathVariable Long id,
    @RequestParam String role) {
    // Change user role
}

@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    // Delete user
}
```

### Frontend - API Client (Users)
Need to add to apiClient.js:

```javascript
users: {
  getAll: async (page = 0, size = 50) => {
    const response = await fetch(`${API_BASE_URL}/auth/users?page=${page}&size=${size}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  update: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateStatus: async (userId, active) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/status?active=${active}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/role?role=${role}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  delete: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return true;
  }
}
```

### Frontend - AdminDashboard Enhancements

#### 1. Enhanced Listings Section
Current: Shows only pending properties
Needed:
- Tab navigation: All | Active | Pending | Inactive
- Load all properties using `apiClient.properties.getAll()`
- Status change dropdown for each property
- Edit button → opens edit modal
- Delete button with confirmation
- Search and filter functionality

#### 2. User Management Section
Current: Basic user management exists
Needed:
- Create User button → opens create modal
- User table with: Name, Email, Role, Status, Actions
- Activate/Deactivate toggle
- Edit user button
- Change role dropdown
- Delete user with confirmation

## Quick Implementation Guide

### Step 1: Update AdminDashboard Listings Section

```javascript
// In AdminDashboard.jsx

const [allProperties, setAllProperties] = useState([]);
const [propertyFilter, setPropertyFilter] = useState('ALL'); // ALL, ACTIVE, DRAFT, INACTIVE

const loadAllProperties = async () => {
  setPropertiesLoading(true);
  try {
    const response = await apiClient.properties.getAll({
      page: 0,
      size: 100,
      status: propertyFilter === 'ALL' ? '' : propertyFilter
    });
    setAllProperties(response.content || []);
  } catch (error) {
    console.error("Error loading properties:", error);
    toast.error("Failed to load properties");
  } finally {
    setPropertiesLoading(false);
  }
};

const handleChangePropertyStatus = async (propertyId, newStatus) => {
  try {
    await apiClient.properties.changeStatus(propertyId, newStatus);
    toast.success("Property status updated");
    loadAllProperties();
  } catch (error) {
    toast.error("Failed to update status");
  }
};

const handleDeleteProperty = async (propertyId) => {
  if (!confirm("Are you sure you want to delete this property?")) return;
  
  try {
    await apiClient.properties.delete(propertyId);
    toast.success("Property deleted");
    loadAllProperties();
  } catch (error) {
    toast.error("Failed to delete property");
  }
};
```

### Step 2: Add Property Edit Modal

```javascript
const [editingProperty, setEditingProperty] = useState(null);
const [editModalOpen, setEditModalOpen] = useState(false);

const handleEditProperty = (property) => {
  setEditingProperty(property);
  setEditModalOpen(true);
};

const handleSavePropertyEdit = async (updatedData) => {
  try {
    await apiClient.properties.update(editingProperty.id, updatedData, []);
    toast.success("Property updated");
    setEditModalOpen(false);
    loadAllProperties();
  } catch (error) {
    toast.error("Failed to update property");
  }
};
```

### Step 3: Add User Management

```javascript
const [users, setUsers] = useState([]);
const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

const loadUsers = async () => {
  try {
    const response = await apiClient.users.getAll(0, 100);
    setUsers(response.content || []);
  } catch (error) {
    toast.error("Failed to load users");
  }
};

const handleCreateUser = async (userData) => {
  try {
    await apiClient.users.create(userData);
    toast.success("User created");
    setCreateUserModalOpen(false);
    loadUsers();
  } catch (error) {
    toast.error("Failed to create user");
  }
};

const handleToggleUserStatus = async (userId, currentStatus) => {
  try {
    await apiClient.users.updateStatus(userId, !currentStatus);
    toast.success("User status updated");
    loadUsers();
  } catch (error) {
    toast.error("Failed to update user status");
  }
};
```

## Testing Checklist

### Properties Management
- [ ] Load all properties (all statuses)
- [ ] Filter by status (All, Active, Pending, Inactive)
- [ ] Change property status via dropdown
- [ ] Edit property details
- [ ] Delete property
- [ ] Approve pending property
- [ ] Reject pending property

### User Management
- [ ] Load all users
- [ ] Create new user (ADMIN role)
- [ ] Create new user (VENDOR role)
- [ ] Create new user (CONSUMER role)
- [ ] Activate user
- [ ] Deactivate user
- [ ] Change user role
- [ ] Edit user details
- [ ] Delete user

## Next Steps

1. ✅ Backend property endpoints - DONE
2. ✅ Frontend API client for properties - DONE
3. ⏳ Backend user management endpoints - PENDING
4. ⏳ Frontend API client for users - PENDING
5. ⏳ Enhanced AdminDashboard UI - PENDING

The foundation is in place. The admin can now:
- View all properties
- Change property status
- Edit properties
- Delete properties

Still needed:
- User management backend endpoints
- User management frontend implementation
- Enhanced UI for property management
