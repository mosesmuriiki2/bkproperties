package com.globalhub.property.dto;

import com.globalhub.property.entity.PropertyType;
import com.globalhub.property.entity.ListingType;
import com.globalhub.property.entity.PropertyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    
    private Long id;
    private Long vendorId;
    private String vendorName;
    private String vendorPhone;
    private String vendorEmail;
    
    private String title;
    private String description;
    private PropertyType propertyType;
    private ListingType listingType;
    
    private BigDecimal price;
    private String currency;
    private String formattedPrice; // e.g., "KSh 5,000,000"
    
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal areaSqm;
    private BigDecimal landSizeSqm;
    
    private String address;
    private String county;
    private String subCounty;
    private BigDecimal latitude;
    private BigDecimal longitude;
    
    private List<String> features;
    private List<String> amenities;
    private List<String> images;
    
    private PropertyStatus status;
    private Integer viewsCount;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}