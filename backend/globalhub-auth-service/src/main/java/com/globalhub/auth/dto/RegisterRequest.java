package com.globalhub.auth.dto;

import com.globalhub.auth.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role; // CONSUMER, VENDOR, ADMIN
    
    // Vendor-specific fields (for property owners)
    private String businessName;
    private String businessType; // individual or company
    private String taxNumber;
    private String licenseNumber;
    private String propertyCategory; // HOUSE, LAND, BOTH
    private String listingType; // SALE, RENT, BOTH
    private String county;
    private String subCounty;
    private String address;
    private String website;
    private String description;
    private String idNumber;
}
