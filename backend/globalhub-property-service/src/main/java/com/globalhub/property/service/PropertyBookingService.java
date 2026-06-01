package com.globalhub.property.service;

import com.globalhub.property.dto.PropertyBookingDTO;
import com.globalhub.property.entity.Property;
import com.globalhub.property.entity.PropertyBooking;
import com.globalhub.property.repository.PropertyBookingRepository;
import com.globalhub.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyBookingService {
    
    private final PropertyBookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final VendorAvailabilityService availabilityService;
    
    @Transactional
    public PropertyBookingDTO createBooking(PropertyBookingDTO dto) {
        // Validate property exists
        Property property = propertyRepository.findById(dto.getPropertyId())
            .orElseThrow(() -> new RuntimeException("Property not found"));
        
        PropertyBooking booking = new PropertyBooking();
        booking.setPropertyId(dto.getPropertyId());
        booking.setVendorId(property.getVendorId());
        booking.setCustomerId(dto.getCustomerId());
        booking.setCustomerName(dto.getCustomerName());
        booking.setCustomerEmail(dto.getCustomerEmail());
        booking.setCustomerPhone(dto.getCustomerPhone());
        booking.setBookingDate(dto.getBookingDate());
        booking.setBookingTime(dto.getBookingTime());
        booking.setBookingType(dto.getBookingType() != null ? dto.getBookingType() : PropertyBooking.BookingType.VIEWING);
        booking.setStatus(PropertyBooking.BookingStatus.PENDING);
        booking.setMessage(dto.getMessage());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setVendorNotified(false);
        booking.setCustomerNotified(false);
        
        PropertyBooking saved = bookingRepository.save(booking);
        
        return mapToDTO(saved, property.getTitle());
    }
    
    @Transactional
    public PropertyBookingDTO confirmBooking(Long bookingId) {
        PropertyBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(PropertyBooking.BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());
        
        PropertyBooking updated = bookingRepository.save(booking);
        Property property = propertyRepository.findById(updated.getPropertyId()).orElse(null);
        
        return mapToDTO(updated, property != null ? property.getTitle() : null);
    }
    
    @Transactional
    public PropertyBookingDTO cancelBooking(Long bookingId, String reason) {
        PropertyBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(PropertyBooking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);
        
        PropertyBooking updated = bookingRepository.save(booking);
        Property property = propertyRepository.findById(updated.getPropertyId()).orElse(null);
        
        return mapToDTO(updated, property != null ? property.getTitle() : null);
    }
    
    @Transactional
    public PropertyBookingDTO markAsCompleted(Long bookingId) {
        PropertyBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(PropertyBooking.BookingStatus.COMPLETED);
        
        PropertyBooking updated = bookingRepository.save(booking);
        Property property = propertyRepository.findById(updated.getPropertyId()).orElse(null);
        
        return mapToDTO(updated, property != null ? property.getTitle() : null);
    }
    
    @Transactional
    public void markVendorNotified(Long bookingId) {
        PropertyBooking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setVendorNotified(true);
        bookingRepository.save(booking);
    }
    
    public Page<PropertyBookingDTO> getVendorBookings(Long vendorId, int page, int size) {
        return bookingRepository.findByVendorIdOrderByCreatedAtDesc(vendorId, PageRequest.of(page, size))
            .map(booking -> {
                Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
                return mapToDTO(booking, property != null ? property.getTitle() : null);
            });
    }
    
    public Page<PropertyBookingDTO> getCustomerBookings(Long customerId, int page, int size) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, PageRequest.of(page, size))
            .map(booking -> {
                Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
                return mapToDTO(booking, property != null ? property.getTitle() : null);
            });
    }
    
    public List<PropertyBookingDTO> getUpcomingVendorBookings(Long vendorId) {
        return bookingRepository.findUpcomingBookingsForVendor(vendorId, LocalDate.now())
            .stream()
            .map(booking -> {
                Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
                return mapToDTO(booking, property != null ? property.getTitle() : null);
            })
            .collect(Collectors.toList());
    }
    
    public List<PropertyBookingDTO> getUpcomingCustomerBookings(Long customerId) {
        return bookingRepository.findUpcomingBookingsForCustomer(customerId, LocalDate.now())
            .stream()
            .map(booking -> {
                Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);
                return mapToDTO(booking, property != null ? property.getTitle() : null);
            })
            .collect(Collectors.toList());
    }
    
    public Long countNewBookingsForVendor(Long vendorId) {
        return bookingRepository.countNewBookingsForVendor(vendorId);
    }
    
    private PropertyBookingDTO mapToDTO(PropertyBooking entity, String propertyTitle) {
        PropertyBookingDTO dto = new PropertyBookingDTO();
        dto.setId(entity.getId());
        dto.setPropertyId(entity.getPropertyId());
        dto.setPropertyTitle(propertyTitle);
        dto.setVendorId(entity.getVendorId());
        dto.setCustomerId(entity.getCustomerId());
        dto.setCustomerName(entity.getCustomerName());
        dto.setCustomerEmail(entity.getCustomerEmail());
        dto.setCustomerPhone(entity.getCustomerPhone());
        dto.setBookingDate(entity.getBookingDate());
        dto.setBookingTime(entity.getBookingTime());
        dto.setBookingType(entity.getBookingType());
        dto.setStatus(entity.getStatus());
        dto.setMessage(entity.getMessage());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setConfirmedAt(entity.getConfirmedAt());
        dto.setCancelledAt(entity.getCancelledAt());
        dto.setCancellationReason(entity.getCancellationReason());
        dto.setVendorNotified(entity.getVendorNotified());
        dto.setCustomerNotified(entity.getCustomerNotified());
        return dto;
    }
}
