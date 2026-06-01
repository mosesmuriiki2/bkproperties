package com.globalhub.property.dto;

import com.globalhub.property.entity.VendorAvailability;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAvailabilityDTO {
    private Long id;
    private Long vendorId;
    private Long propertyId;
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxBookings;
    private Integer currentBookings;
    private VendorAvailability.AvailabilityStatus status;
    private String notes;
    private Boolean isAvailable;
}
