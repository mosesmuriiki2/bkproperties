package com.globalhub.property.repository;

import com.globalhub.property.entity.PropertyBooking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PropertyBookingRepository extends JpaRepository<PropertyBooking, Long> {
    
    Page<PropertyBooking> findByVendorIdOrderByCreatedAtDesc(Long vendorId, Pageable pageable);
    
    Page<PropertyBooking> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    
    Page<PropertyBooking> findByPropertyIdOrderByCreatedAtDesc(Long propertyId, Pageable pageable);
    
    List<PropertyBooking> findByVendorIdAndStatusOrderByBookingDateAsc(
        Long vendorId, PropertyBooking.BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM PropertyBooking b WHERE b.vendorId = :vendorId " +
           "AND b.status = 'PENDING' AND b.vendorNotified = false")
    Long countNewBookingsForVendor(Long vendorId);
    
    @Query("SELECT b FROM PropertyBooking b WHERE b.vendorId = :vendorId " +
           "AND b.bookingDate >= :fromDate ORDER BY b.bookingDate ASC, b.bookingTime ASC")
    List<PropertyBooking> findUpcomingBookingsForVendor(Long vendorId, LocalDate fromDate);
    
    @Query("SELECT b FROM PropertyBooking b WHERE b.customerId = :customerId " +
           "AND b.bookingDate >= :fromDate ORDER BY b.bookingDate ASC, b.bookingTime ASC")
    List<PropertyBooking> findUpcomingBookingsForCustomer(Long customerId, LocalDate fromDate);
}
