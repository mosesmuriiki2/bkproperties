# Customer Booking Feature Implementation

## Overview
Added a complete booking/scheduling system to the PropertyDetail page, allowing customers to view available time slots and schedule property viewings directly from the property details page.

## Features Implemented

### 1. Schedule Viewing Button
- Added "Schedule Viewing" button in the contact card sidebar
- Button triggers the booking dialog when clicked
- Automatically loads available time slots for the property

### 2. Booking Dialog
The booking dialog includes:

#### Available Time Slots Section:
- **Grid Display**: Shows all available slots in a 2-column grid
- **Slot Information**:
  - Date (formatted as "Mon, Jan 15")
  - Time range (e.g., "09:00 - 10:00")
  - Notes from vendor (if any)
  - Available slots count
- **Visual Selection**: 
  - Click to select a slot
  - Selected slot highlighted with green border and background
  - Checkmark icon on selected slot
- **Loading State**: Shows spinner while fetching slots
- **Empty State**: Displays message if no slots available

#### Booking Form (appears after slot selection):
- **Customer Name** (required)
- **Email** (required)
- **Phone Number** (required)
- **Booking Type** (dropdown):
  - Property Viewing
  - Property Inspection
  - Consultation
  - Site Visit
- **Message** (optional textarea)

#### Booking Summary:
- Shows selected property title
- Displays full date (e.g., "Monday, January 15, 2026")
- Shows time range
- Displays booking type
- Green highlighted summary box

### 3. Form Validation
- Checks if slot is selected
- Validates all required fields are filled
- Shows error toasts for validation failures

### 4. Booking Submission
- Submits booking request to backend
- Includes customer information
- Links to user account if logged in (customerId)
- Shows loading state during submission
- Success toast notification
- Clears form after successful submission

### 5. User Experience
- **Responsive Design**: Works on mobile and desktop
- **Smooth Interactions**: Hover effects, transitions
- **Clear Feedback**: Loading states, success/error messages
- **Easy Navigation**: Cancel button to close dialog

## User Flow

1. **Customer views property details**
   - Sees property information, images, features
   - Contact card in sidebar

2. **Click "Schedule Viewing"**
   - Dialog opens
   - System loads available time slots from backend

3. **Select time slot**
   - Customer clicks on preferred date/time
   - Slot highlights in green
   - Booking form appears below

4. **Fill in information**
   - Enter name, email, phone
   - Select booking type
   - Add optional message

5. **Review summary**
   - Check booking details in summary box
   - Verify date, time, property

6. **Confirm booking**
   - Click "Confirm Booking"
   - System submits request
   - Success message displayed
   - Vendor receives notification

7. **Vendor confirms**
   - Vendor sees booking in their dashboard
   - Can confirm or cancel
   - Customer receives confirmation

## Technical Implementation

### API Integration:
```javascript
// Load available slots
const slots = await apiClient.availability.getAvailableSlots(propertyId);

// Submit booking
await apiClient.bookings.create({
  propertyId: parseInt(id),
  customerId: customerId,
  customerName: bookingForm.customerName,
  customerEmail: bookingForm.customerEmail,
  customerPhone: bookingForm.customerPhone,
  bookingDate: selectedSlot.availableDate,
  bookingTime: selectedSlot.startTime,
  bookingType: bookingForm.bookingType,
  message: bookingForm.message
});
```

### State Management:
- `bookingDialog`: Controls dialog visibility
- `availableSlots`: Stores fetched time slots
- `slotsLoading`: Loading state for slots
- `selectedSlot`: Currently selected time slot
- `bookingForm`: Form data (name, email, phone, message, type)
- `bookingSubmitting`: Submission loading state

### Components Used:
- Dialog (from shadcn/ui)
- Input (from shadcn/ui)
- Select (from shadcn/ui)
- Button (from shadcn/ui)
- Badge (from shadcn/ui)
- Icons (from lucide-react)

## Visual Design

### Color Scheme:
- **Primary**: Emerald green (#10b981)
- **Selected State**: Emerald-50 background, Emerald-500 border
- **Hover State**: Emerald-300 border
- **Summary Box**: Emerald-50 background with emerald-200 border

### Layout:
- **Dialog**: Max width 2xl, scrollable
- **Slots Grid**: 2 columns on desktop, 1 on mobile
- **Form**: Single column, full width inputs
- **Summary**: Full width, highlighted box

## Error Handling

1. **No Available Slots**:
   - Shows empty state with calendar icon
   - Message: "No available time slots at the moment"
   - Suggests contacting vendor directly

2. **Validation Errors**:
   - "Please select a time slot"
   - "Please fill in all required fields"

3. **Submission Errors**:
   - "Failed to submit booking request"
   - Logs error to console

## Future Enhancements

1. **Email Notifications**:
   - Send confirmation email to customer
   - Notify vendor of new booking

2. **SMS Notifications**:
   - SMS confirmation to customer
   - SMS alert to vendor

3. **Calendar Integration**:
   - Add to Google Calendar
   - Download iCal file

4. **Booking History**:
   - Show customer's past bookings
   - Booking status tracking

5. **Rescheduling**:
   - Allow customers to reschedule
   - Cancel bookings

6. **Payment Integration**:
   - Optional booking deposit
   - Payment for premium viewings

7. **Video Viewings**:
   - Schedule virtual tours
   - Video call integration

## Testing Checklist

- [x] Dialog opens when clicking "Schedule Viewing"
- [x] Available slots load from backend
- [x] Slots display correctly with date/time
- [x] Slot selection works (visual feedback)
- [x] Form appears after slot selection
- [x] All form fields work correctly
- [x] Booking type dropdown works
- [x] Summary displays correct information
- [x] Validation works for required fields
- [x] Booking submits successfully
- [x] Success toast appears
- [x] Form clears after submission
- [x] Cancel button closes dialog
- [x] Loading states display correctly
- [x] Empty state shows when no slots
- [x] Responsive on mobile devices

## Files Modified

- `src/pages/PropertyDetail.jsx` - Added booking dialog and functionality

## Dependencies

All dependencies already exist in the project:
- React hooks (useState, useEffect)
- React Router (useParams, useNavigate)
- shadcn/ui components (Dialog, Input, Select, Button, Badge)
- lucide-react icons
- sonner (toast notifications)
- apiClient (API integration)

## Status

✅ Customer booking interface implemented
✅ Available slots display working
✅ Booking form with validation
✅ Booking submission to backend
✅ Success/error handling
✅ Responsive design
✅ Loading states
✅ Empty states
⏳ Email notifications (pending)
⏳ SMS notifications (pending)
⏳ Calendar integration (pending)

## How to Test

1. **Start the application**:
   ```bash
   # Frontend
   npm run dev
   
   # Backend (if not running)
   cd backend/globalhub-property-service
   mvn spring-boot:run
   ```

2. **Navigate to a property**:
   - Go to home page
   - Click on any featured property
   - Or go to Properties page and click a property

3. **Schedule a viewing**:
   - Click "Schedule Viewing" button in sidebar
   - Select an available time slot
   - Fill in your information
   - Click "Confirm Booking"

4. **Verify vendor receives booking**:
   - Login as vendor
   - Go to "Bookings" section
   - See the new booking with "New" badge
   - Confirm or cancel the booking

## Notes

- Customer ID is set to 0 if user is not logged in
- Booking status starts as "PENDING"
- Vendor receives notification flag set to false initially
- Vendor can confirm/cancel from their dashboard
- System tracks booking history for analytics
