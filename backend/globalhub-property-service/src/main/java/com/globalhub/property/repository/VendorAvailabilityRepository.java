package com.globalhub.property.repository;

import com.globalhub.property.entity.VendorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VendorAvailabilityRepository extends JpaRepository<VendorAvailability, Long> {
    
    List<VendorAvailability> findByVendorIdAndAvailableDateGreaterThanEqualOrderByAvailableDateAsc(
        Long vendorId, LocalDate fromDate);
    
    List<VendorAvailability> findByPropertyIdAndAvailableDateGreaterThanEqualOrderByAvailableDateAsc(
        Long propertyId, LocalDate fromDate);
    
    List<VendorAvailability> findByVendorIdAndAvailableDateBetweenOrderByAvailableDateAsc(
        Long vendorId, LocalDate startDate, LocalDate endDate);
    
    List<VendorAvailability> findByPropertyIdAndAvailableDateBetweenOrderByAvailableDateAsc(
        Long propertyId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT va FROM VendorAvailability va WHERE va.propertyId = :propertyId " +
           "AND va.availableDate >= :fromDate AND va.status = 'AVAILABLE' " +
           "AND va.currentBookings < va.maxBookings ORDER BY va.availableDate ASC")
    List<VendorAvailability> findAvailableSlotsForProperty(Long propertyId, LocalDate fromDate);
}
