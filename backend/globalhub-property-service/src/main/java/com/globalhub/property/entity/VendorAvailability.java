package com.globalhub.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "vendor_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAvailability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long vendorId;
    
    @Column(nullable = false)
    private Long propertyId;
    
    @Column(nullable = false)
    private LocalDate availableDate;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false)
    private Integer maxBookings = 1; // How many bookings can be made for this slot
    
    @Column(nullable = false)
    private Integer currentBookings = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus status = AvailabilityStatus.AVAILABLE;
    
    private String notes;
    
    public enum AvailabilityStatus {
        AVAILABLE,
        FULLY_BOOKED,
        BLOCKED
    }
    
    public boolean isAvailable() {
        return status == AvailabilityStatus.AVAILABLE && currentBookings < maxBookings;
    }
}
