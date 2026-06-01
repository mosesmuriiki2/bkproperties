package com.globalhub.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "property_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long propertyId;
    
    @Column(nullable = false)
    private Long vendorId;
    
    @Column(nullable = false)
    private Long customerId;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerEmail;
    
    @Column(nullable = false)
    private String customerPhone;
    
    @Column(nullable = false)
    private LocalDate bookingDate;
    
    @Column(nullable = false)
    private LocalTime bookingTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingType bookingType = BookingType.VIEWING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(length = 1000)
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime confirmedAt;
    
    private LocalDateTime cancelledAt;
    
    private String cancellationReason;
    
    @Column(nullable = false)
    private Boolean vendorNotified = false;
    
    @Column(nullable = false)
    private Boolean customerNotified = false;
    
    public enum BookingType {
        VIEWING,
        INSPECTION,
        CONSULTATION,
        SITE_VISIT
    }
    
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED,
        NO_SHOW
    }
}
