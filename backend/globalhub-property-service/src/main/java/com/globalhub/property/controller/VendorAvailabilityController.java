package com.globalhub.property.controller;

import com.globalhub.property.dto.VendorAvailabilityDTO;
import com.globalhub.property.service.VendorAvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@Tag(name = "Vendor Availability", description = "APIs for managing vendor availability calendar")
public class VendorAvailabilityController {
    
    private final VendorAvailabilityService availabilityService;
    
    @PostMapping
    @Operation(summary = "Create availability slot")
    public ResponseEntity<VendorAvailabilityDTO> createAvailability(@RequestBody VendorAvailabilityDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(availabilityService.createAvailability(dto));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update availability slot")
    public ResponseEntity<VendorAvailabilityDTO> updateAvailability(
            @PathVariable Long id,
            @RequestBody VendorAvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.updateAvailability(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete availability slot")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get vendor availability")
    public ResponseEntity<List<VendorAvailabilityDTO>> getVendorAvailability(
            @PathVariable Long vendorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        LocalDate from = fromDate != null ? fromDate : LocalDate.now();
        return ResponseEntity.ok(availabilityService.getVendorAvailability(vendorId, from));
    }
    
    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Get property availability for customers")
    public ResponseEntity<List<VendorAvailabilityDTO>> getPropertyAvailability(
            @PathVariable Long propertyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        LocalDate from = fromDate != null ? fromDate : LocalDate.now();
        return ResponseEntity.ok(availabilityService.getPropertyAvailability(propertyId, from));
    }
    
    @GetMapping("/property/{propertyId}/available")
    @Operation(summary = "Get only available slots for property")
    public ResponseEntity<List<VendorAvailabilityDTO>> getAvailableSlots(@PathVariable Long propertyId) {
        return ResponseEntity.ok(availabilityService.getAvailableSlotsForProperty(propertyId));
    }
}
