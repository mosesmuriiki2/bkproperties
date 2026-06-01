package com.globalhub.vendor.dto;

import com.globalhub.vendor.entity.VendorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {
    private Long id;
    private Long userId;
    private String businessName;
    private String businessType;
    private String taxNumber;
    private String licenseNumber;
    private String propertyCategory; // HOUSE, LAND, BOTH
    private String listingType; // SALE, RENT, BOTH
    private VendorStatus status;
    private Double rating;
    private String email;
    private String phone;
    private String address;
    private String county;
    private String subCounty;
    private String website;
    private String description;
    private String idNumber;
    private List<VendorDocumentDTO> documents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
