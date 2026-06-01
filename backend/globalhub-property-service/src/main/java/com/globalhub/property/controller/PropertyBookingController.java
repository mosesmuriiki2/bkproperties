package com.globalhub.property.controller;

import com.globalhub.property.dto.PropertyBookingDTO;
import com.globalhub.property.service.PropertyBookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Property Bookings", description = "APIs for managing property viewing/inspection bookings")
public class PropertyBookingController {
    
    private final PropertyBookingService bookingService;
    
    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<PropertyBookingDTO> createBooking(@RequestBody PropertyBookingDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(bookingService.createBooking(dto));
    }
    
    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm booking (Vendor action)")
    public ResponseEntity<PropertyBookingDTO> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }
    
    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<PropertyBookingDTO> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }
    
    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark booking as completed")
    public ResponseEntity<PropertyBookingDTO> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.markAsCompleted(id));
    }
    
    @PutMapping("/{id}/notify")
    @Operation(summary = "Mark vendor as notified")
    public ResponseEntity<Void> markVendorNotified(@PathVariable Long id) {
        bookingService.markVendorNotified(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get all bookings for vendor")
    public ResponseEntity<Page<PropertyBookingDTO>> getVendorBookings(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bookingService.getVendorBookings(vendorId, page, size));
    }
    
    @GetMapping("/vendor/{vendorId}/upcoming")
    @Operation(summary = "Get upcoming bookings for vendor")
    public ResponseEntity<List<PropertyBookingDTO>> getUpcomingVendorBookings(@PathVariable Long vendorId) {
        return ResponseEntity.ok(bookingService.getUpcomingVendorBookings(vendorId));
    }
    
    @GetMapping("/vendor/{vendorId}/count/new")
    @Operation(summary = "Count new unnotified bookings for vendor")
    public ResponseEntity<Long> countNewBookings(@PathVariable Long vendorId) {
        return ResponseEntity.ok(bookingService.countNewBookingsForVendor(vendorId));
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get all bookings for customer")
    public ResponseEntity<Page<PropertyBookingDTO>> getCustomerBookings(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId, page, size));
    }
    
    @GetMapping("/customer/{customerId}/upcoming")
    @Operation(summary = "Get upcoming bookings for customer")
    public ResponseEntity<List<PropertyBookingDTO>> getUpcomingCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getUpcomingCustomerBookings(customerId));
    }
}
