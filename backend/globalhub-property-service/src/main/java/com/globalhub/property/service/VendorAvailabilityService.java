package com.globalhub.property.service;

import com.globalhub.property.dto.VendorAvailabilityDTO;
import com.globalhub.property.entity.VendorAvailability;
import com.globalhub.property.repository.VendorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorAvailabilityService {
    
    private final VendorAvailabilityRepository availabilityRepository;
    
    @Transactional
    public VendorAvailabilityDTO createAvailability(VendorAvailabilityDTO dto) {
        VendorAvailability availability = new VendorAvailability();
        availability.setVendorId(dto.getVendorId());
        availability.setPropertyId(dto.getPropertyId());
        availability.setAvailableDate(dto.getAvailableDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setMaxBookings(dto.getMaxBookings() != null ? dto.getMaxBookings() : 1);
        availability.setCurrentBookings(0);
        availability.setStatus(VendorAvailability.AvailabilityStatus.AVAILABLE);
        availability.setNotes(dto.getNotes());
        
        VendorAvailability saved = availabilityRepository.save(availability);
        return mapToDTO(saved);
    }
    
    @Transactional
    public VendorAvailabilityDTO updateAvailability(Long id, VendorAvailabilityDTO dto) {
        VendorAvailability availability = availabilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Availability not found"));
        
        availability.setAvailableDate(dto.getAvailableDate());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setMaxBookings(dto.getMaxBookings());
        availability.setStatus(dto.getStatus());
        availability.setNotes(dto.getNotes());
        
        VendorAvailability updated = availabilityRepository.save(availability);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
    
    public List<VendorAvailabilityDTO> getVendorAvailability(Long vendorId, LocalDate fromDate) {
        return availabilityRepository
            .findByVendorIdAndAvailableDateGreaterThanEqualOrderByAvailableDateAsc(vendorId, fromDate)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public List<VendorAvailabilityDTO> getPropertyAvailability(Long propertyId, LocalDate fromDate) {
        return availabilityRepository
            .findByPropertyIdAndAvailableDateGreaterThanEqualOrderByAvailableDateAsc(propertyId, fromDate)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public List<VendorAvailabilityDTO> getAvailableSlotsForProperty(Long propertyId) {
        return availabilityRepository
            .findAvailableSlotsForProperty(propertyId, LocalDate.now())
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void incrementBookingCount(Long availabilityId) {
        VendorAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new RuntimeException("Availability not found"));
        
        availability.setCurrentBookings(availability.getCurrentBookings() + 1);
        
        if (availability.getCurrentBookings() >= availability.getMaxBookings()) {
            availability.setStatus(VendorAvailability.AvailabilityStatus.FULLY_BOOKED);
        }
        
        availabilityRepository.save(availability);
    }
    
    @Transactional
    public void decrementBookingCount(Long availabilityId) {
        VendorAvailability availability = availabilityRepository.findById(availabilityId)
            .orElseThrow(() -> new RuntimeException("Availability not found"));
        
        if (availability.getCurrentBookings() > 0) {
            availability.setCurrentBookings(availability.getCurrentBookings() - 1);
            
            if (availability.getCurrentBookings() < availability.getMaxBookings()) {
                availability.setStatus(VendorAvailability.AvailabilityStatus.AVAILABLE);
            }
            
            availabilityRepository.save(availability);
        }
    }
    
    private VendorAvailabilityDTO mapToDTO(VendorAvailability entity) {
        VendorAvailabilityDTO dto = new VendorAvailabilityDTO();
        dto.setId(entity.getId());
        dto.setVendorId(entity.getVendorId());
        dto.setPropertyId(entity.getPropertyId());
        dto.setAvailableDate(entity.getAvailableDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setMaxBookings(entity.getMaxBookings());
        dto.setCurrentBookings(entity.getCurrentBookings());
        dto.setStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());
        dto.setIsAvailable(entity.isAvailable());
        return dto;
    }
}
