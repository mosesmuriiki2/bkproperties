package com.globalhub.property.repository;

import com.globalhub.property.entity.InquiryStatus;
import com.globalhub.property.entity.PropertyInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyInquiryRepository extends JpaRepository<PropertyInquiry, Long> {
    
    // Find inquiries by vendor ID
    Page<PropertyInquiry> findByVendorId(Long vendorId, Pageable pageable);
    
    // Find inquiries by property ID
    Page<PropertyInquiry> findByPropertyId(Long propertyId, Pageable pageable);
    
    // Find inquiries by status
    Page<PropertyInquiry> findByStatus(InquiryStatus status, Pageable pageable);
    
    // Find inquiries by vendor and status
    Page<PropertyInquiry> findByVendorIdAndStatus(Long vendorId, InquiryStatus status, Pageable pageable);
    
    // Count new inquiries for vendor
    @Query("SELECT COUNT(i) FROM PropertyInquiry i WHERE i.vendorId = :vendorId AND i.status = 'NEW'")
    Long countNewInquiriesByVendor(@Param("vendorId") Long vendorId);
    
    // Count all new inquiries (for admin)
    Long countByStatus(InquiryStatus status);
}
