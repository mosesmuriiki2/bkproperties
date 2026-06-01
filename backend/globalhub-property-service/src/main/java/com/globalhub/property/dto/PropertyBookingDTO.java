package com.globalhub.property.dto;

import com.globalhub.property.entity.PropertyBooking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyBookingDTO {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private Long vendorId;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private PropertyBooking.BookingType bookingType;
    private PropertyBooking.BookingStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private Boolean vendorNotified;
    private Boolean customerNotified;
}
