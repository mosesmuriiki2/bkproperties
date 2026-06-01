# Booking Calendar System Implementation

## Overview
Implemented a comprehensive booking calendar system that allows vendors to set their availability and customers to schedule property viewings/inspections. Vendors receive notifications when new bookings are made.

## Features Implemented

### 1. Backend Components

#### Entities Created:
- **VendorAvailability**: Manages vendor availability slots
  - Date, time range, max bookings per slot
  - Status tracking (AVAILABLE, FULLY_BOOKED, BLOCKED)
  - Property and vendor association

- **PropertyBooking**: Manages customer bookings
  - Customer information (name, email, phone)
  - Booking date and time
  - Booking type (VIEWING, INSPECTION, CONSULTATION, SITE_VISIT)
  - Status tracking (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
  - Notification flags for vendor and customer

#### Repositories:
- `VendorAvailabilityRepository`: Query availability by vendor, property, date range
- `PropertyBookingRepository`: Query bookings with pagination, count new bookings

#### Services:
- `VendorAvailabilityService`: CRUD operations for availability slots
- `PropertyBookingService`: Booking management, confirmation, cancellation

#### Controllers:
- `VendorAvailabilityController` (`/api/availability`)
  - POST `/` - Create availability slot
  - PUT `/{id}` - Update availability
  - DELETE `/{id}` - Delete availability
  - GET `/vendor/{vendorId}` - Get vendor availability
  - GET `/property/{propertyId}` - Get property availability
  - GET `/property/{propertyId}/available` - Get only available slots

- `PropertyBookingController` (`/api/bookings`)
  - POST `/` - Create booking
  - PUT `/{id}/confirm` - Confirm booking (vendor action)
  - PUT `/{id}/cancel` - Cancel booking
  - PUT `/{id}/complete` - Mark as completed
  - PUT `/{id}/notify` - Mark vendor as notified
  - GET `/vendor/{vendorId}` - Get vendor bookings (paginated)
  - GET `/vendor/{vendorId}/upcoming` - Get upcoming bookings
  - GET `/vendor/{vendorId}/count/new` - Count new unnotified bookings
  - GET `/customer/{customerId}` - Get customer bookings
  - GET `/customer/{customerId}/upcoming` - Get upcoming bookings

### 2. Database Tables

Created two new tables:
- `vendor_availability`: Stores availability slots
- `property_bookings`: Stores customer bookings

Sample data included for testing.

### 3. Frontend Components

#### API Client Methods:
Added `bookings` and `availability` sections to `apiClient.js` with full CRUD operations.

#### Vendor Dashboard Enhancements:
- **New Navigation Items**:
  - "Booking Calendar" - Manage availability slots
  - "Bookings" - View and manage customer bookings

- **Calendar Section**:
  - View all availability slots in card grid
  - Add new availability slots with dialog
  - Delete availability slots
  - Visual indicators for available vs fully booked slots
  - Shows booking count per slot

- **Bookings Section**:
  - List all customer bookings
  - "New" badge for unnotified bookings
  - Status badges (PENDING, CONFIRMED, CANCELLED)
  - Confirm/Cancel actions for pending bookings
  - Customer contact information display
  - Booking date/time display

#### Availability Dialog:
- Select property from vendor's listings
- Choose date (future dates only)
- Set time range (start/end time)
- Set max bookings per slot
- Add optional notes

### 4. Notification System

- **New Bookings Counter**: Shows count of new unnotified bookings
- **Visual Indicators**: Green highlight for new bookings
- **Auto-notification**: Vendor marked as notified when confirming booking

## Usage Flow

### For Vendors:

1. **Set Availability**:
   - Navigate to "Booking Calendar"
   - Click "Add Availability"
   - Select property, date, time range
   - Set how many bookings can be made in that slot
   - Save

2. **Manage Bookings**:
   - Navigate to "Bookings"
   - See new bookings with "New" badge
   - Review customer details and requested time
   - Confirm or cancel bookings
   - System tracks notification status

### For Customers (Future Implementation):

1. View property details
2. See available time slots
3. Select preferred date/time
4. Fill in contact information
5. Submit booking request
6. Receive confirmation when vendor approves

## Database Schema

```sql
-- Vendor Availability
CREATE TABLE vendor_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_bookings INT NOT NULL DEFAULT 1,
    current_bookings INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    notes VARCHAR(500)
);

-- Property Bookings
CREATE TABLE property_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    booking_type VARCHAR(20) NOT NULL DEFAULT 'VIEWING',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason VARCHAR(500),
    vendor_notified BOOLEAN NOT NULL DEFAULT FALSE,
    customer_notified BOOLEAN NOT NULL DEFAULT FALSE
);
```

## API Endpoints

### Availability Management
- `POST /api/availability` - Create availability
- `PUT /api/availability/{id}` - Update availability
- `DELETE /api/availability/{id}` - Delete availability
- `GET /api/availability/vendor/{vendorId}` - Get vendor availability
- `GET /api/availability/property/{propertyId}` - Get property availability
- `GET /api/availability/property/{propertyId}/available` - Get available slots

### Booking Management
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}/confirm` - Confirm booking
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `PUT /api/bookings/{id}/complete` - Complete booking
- `PUT /api/bookings/{id}/notify` - Mark notified
- `GET /api/bookings/vendor/{vendorId}` - Get vendor bookings
- `GET /api/bookings/vendor/{vendorId}/upcoming` - Get upcoming
- `GET /api/bookings/vendor/{vendorId}/count/new` - Count new
- `GET /api/bookings/customer/{customerId}` - Get customer bookings
- `GET /api/bookings/customer/{customerId}/upcoming` - Get upcoming

## Files Modified/Created

### Backend:
- `VendorAvailability.java` - Entity
- `PropertyBooking.java` - Entity
- `VendorAvailabilityRepository.java` - Repository
- `PropertyBookingRepository.java` - Repository
- `VendorAvailabilityDTO.java` - DTO
- `PropertyBookingDTO.java` - DTO
- `VendorAvailabilityService.java` - Service
- `PropertyBookingService.java` - Service
- `VendorAvailabilityController.java` - Controller
- `PropertyBookingController.java` - Controller
- `add-booking-calendar-tables.sql` - Database migration

### Frontend:
- `src/api/apiClient.js` - Added bookings and availability methods
- `src/pages/VendorDashboard.jsx` - Added calendar and bookings sections

## Testing

1. **Database Setup**:
   ```bash
   mysql -u root -pPassword@224 < backend/add-booking-calendar-tables.sql
   ```

2. **Start Property Service**:
   ```bash
   cd backend/globalhub-property-service
   mvn spring-boot:run
   ```

3. **Test Vendor Dashboard**:
   - Login as vendor
   - Navigate to "Booking Calendar"
   - Add availability slots
   - Navigate to "Bookings" to see customer bookings

## Next Steps

1. **Customer Booking Interface**:
   - Add booking form to property detail page
   - Show available time slots calendar
   - Allow customers to select and book slots

2. **Email Notifications**:
   - Send email to vendor when new booking is made
   - Send confirmation email to customer
   - Send reminder emails before booking date

3. **SMS Notifications** (Optional):
   - SMS alerts for new bookings
   - Booking reminders

4. **Calendar Integration**:
   - Export to Google Calendar
   - iCal format support

5. **Advanced Features**:
   - Recurring availability (e.g., every Monday 9-5)
   - Bulk availability creation
   - Booking analytics and reports
   - No-show tracking and penalties

## Status

✅ Backend entities and services implemented
✅ Database tables created with sample data
✅ API endpoints created and tested
✅ Frontend vendor dashboard updated
✅ Booking calendar UI implemented
✅ Bookings management UI implemented
✅ Notification system implemented
⏳ Customer booking interface (pending)
⏳ Email notifications (pending)
