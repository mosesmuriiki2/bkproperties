package com.globalhub.vendor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String businessName;
    
    private String businessType;
    
    // Property-specific fields
    @Enumerated(EnumType.STRING)
    private PropertyCategory propertyCategory; // HOUSE, LAND, BOTH
    
    @Enumerated(EnumType.STRING)
    private ListingType listingType; // SALE, RENT, BOTH
    
    private String taxNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VendorStatus status = VendorStatus.PENDING;
    
    @Builder.Default
    private Double rating = 0.0;
    
    private String email;
    
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    private String county; // Kenya county
    
    private String subCounty;
    
    private String website;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // ID/License information
    private String idNumber;
    
    private String licenseNumber;
    
    @OneToMany(mappedBy = "vendorId", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VendorDocument> documents = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
