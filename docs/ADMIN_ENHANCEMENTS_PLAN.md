# Admin Dashboard Enhancements - Implementation Plan

## Requirements

### 1. All Listings Management
- **Fetch ALL properties** from backend (not just pending)
- Show ACTIVE, DRAFT (pending), and INACTIVE (rejected) properties
- Allow admin to:
  - Change property status (ACTIVE ↔ INACTIVE ↔ DRAFT)
  - Edit property details
  - Delete/delist properties
  - View full property information

### 2. User Management
- **Create new users** with role selection (ADMIN, VENDOR, CONSUMER)
- **Deactivate/Activate users**
- View all users with their details
- Edit user information
- Assign roles

## Implementation Steps

### Backend Endpoints Needed

#### Property Service
- `GET /api/properties` - Get ALL properties (with pagination and filters)
- `PUT /api/properties/{id}` - Update property details
- `PUT /api/properties/{id}/status` - Change property status
- `DELETE /api/properties/{id}` - Delete property

#### User Service (Auth Service)
- `GET /api/auth/users` - Get all users
- `POST /api/auth/users` - Create new user
- `PUT /api/auth/users/{id}` - Update user
- `PUT /api/auth/users/{id}/status` - Activate/Deactivate user
- `PUT /api/auth/users/{id}/role` - Change user role

### Frontend Changes

#### 1. Enhanced Listings Section
```javascript
// Features:
- Tab navigation: All | Active | Pending | Inactive
- Search and filter by vendor, type, price
- Bulk actions (approve, reject, delete)
- Inline status change dropdown
- Edit button → opens edit modal
- Delete button with confirmation
- View details button
```

#### 2. Enhanced User Management Section
```javascript
// Features:
- Create User button → opens create modal
- User table with: Name, Email, Role, Status, Actions
- Activate/Deactivate toggle
- Edit user button
- Change role dropdown
- Delete user (with confirmation)
- Search and filter users
```

### API Client Updates

```javascript
// Add to apiClient.js

properties: {
  // ... existing methods
  getAll: async (page, size, status) => {
    // Get all properties with optional status filter
  },
  updateStatus: async (id, status) => {
    // Change property status
  },
  update: async (id, data, images) => {
    // Update property details
  },
  delete: async (id) => {
    // Delete property
  }
},

users: {
  getAll: async (page, size) => {
    // Get all users
  },
  create: async (userData) => {
    // Create new user
  },
  update: async (id, userData) => {
    // Update user
  },
  updateStatus: async (id, active) => {
    // Activate/deactivate user
  },
  updateRole: async (id, role) => {
    // Change user role
  },
  delete: async (id) => {
    // Delete user
  }
}
```

## UI Components Needed

### 1. Property Edit Modal
- Form with all property fields
- Image upload/management
- Save/Cancel buttons

### 2. User Create/Edit Modal
- Name, Email, Password fields
- Role dropdown (ADMIN, VENDOR, CONSUMER)
- Status toggle (Active/Inactive)
- Save/Cancel buttons

### 3. Confirmation Dialogs
- Delete property confirmation
- Delete user confirmation
- Status change confirmation

### 4. Status Change Dropdown
- Quick status change for properties
- ACTIVE, DRAFT, INACTIVE options

## Database Considerations

### Properties Table
- Ensure `status` column exists with values: ACTIVE, DRAFT, INACTIVE
- Add `updated_at` timestamp
- Add `updated_by` admin user reference

### Users Table
- Ensure `active` boolean column exists
- Ensure `role` column with ENUM: ADMIN, VENDOR, CONSUMER
- Add `created_by` admin user reference

## Security Considerations

1. **Authorization**: Only ADMIN role can access these features
2. **Audit Trail**: Log all admin actions (property edits, user changes)
3. **Validation**: Validate all inputs on backend
4. **Confirmation**: Require confirmation for destructive actions

## Testing Checklist

- [ ] Load all properties (active, pending, inactive)
- [ ] Change property status
- [ ] Edit property details
- [ ] Delete property
- [ ] Create new user with each role
- [ ] Activate/deactivate user
- [ ] Change user role
- [ ] Delete user
- [ ] Search and filter properties
- [ ] Search and filter users
- [ ] Pagination works correctly
- [ ] Error handling for all operations
- [ ] Success messages display correctly

## Next Steps

1. First, check if backend endpoints exist
2. Add missing endpoints to backend
3. Update apiClient.js with new methods
4. Enhance AdminDashboard with new features
5. Test all functionality
6. Document admin user guide
