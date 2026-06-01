package com.globalhub.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType; // HOUSE, APARTMENT, LAND, COMMERCIAL, INDUSTRIAL
    
    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false)
    private ListingType listingType; // SALE, RENT
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    
    @Column(length = 3, nullable = false)
    private String currency = "KSH";
    
    private Integer bedrooms;
    
    private Integer bathrooms;
    
    @Column(name = "area_sqm", precision = 10, scale = 2)
    private BigDecimal areaSqm;
    
    @Column(name = "land_size_sqm", precision = 15, scale = 2)
    private BigDecimal landSizeSqm;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;
    
    @Column(nullable = false, length = 100)
    private String county;
    
    @Column(name = "sub_county", length = 100)
    private String subCounty;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(columnDefinition = "JSON")
    private String features; // JSON array of features
    
    @Column(columnDefinition = "JSON")
    private String amenities; // JSON array of amenities
    
    @Column(columnDefinition = "JSON")
    private String images; // JSON array of image URLs
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status = PropertyStatus.DRAFT;
    
    @Column(name = "views_count", nullable = false)
    private Integer viewsCount = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (viewsCount == null) {
            viewsCount = 0;
        }
        if (currency == null) {
            currency = "KSH";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
