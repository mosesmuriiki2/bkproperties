package com.globalhub.property.service;

import com.globalhub.property.dto.PropertyInquiryDTO;
import com.globalhub.property.entity.InquiryStatus;
import com.globalhub.property.entity.Property;
import com.globalhub.property.entity.PropertyInquiry;
import com.globalhub.property.repository.PropertyInquiryRepository;
import com.globalhub.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyInquiryService {
    
    private final PropertyInquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;
    
    @Transactional
    public PropertyInquiryDTO createInquiry(PropertyInquiryDTO inquiryDTO) {
        log.info("Creating inquiry for property: {}", inquiryDTO.getPropertyId());
        
        // Get property details
        Property property = propertyRepository.findById(inquiryDTO.getPropertyId())
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + inquiryDTO.getPropertyId()));
        
        // Create inquiry
        PropertyInquiry inquiry = PropertyInquiry.builder()
            .propertyId(inquiryDTO.getPropertyId())
            .userId(inquiryDTO.getUserId())
            .name(inquiryDTO.getName())
            .email(inquiryDTO.getEmail())
            .phone(inquiryDTO.getPhone())
            .message(inquiryDTO.getMessage())
            .status(InquiryStatus.NEW)
            .vendorId(property.getVendorId())
            .propertyTitle(property.getTitle())
            .build();
        
        PropertyInquiry savedInquiry = inquiryRepository.save(inquiry);
        log.info("Inquiry created successfully with ID: {}", savedInquiry.getId());
        
        // TODO: Send email notification to vendor
        // emailService.sendInquiryNotification(vendorEmail, property.getTitle(), inquiry.getName());
        
        return mapToDTO(savedInquiry);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyInquiryDTO> getVendorInquiries(Long vendorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PropertyInquiry> inquiries = inquiryRepository.findByVendorId(vendorId, pageable);
        return inquiries.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyInquiryDTO> getVendorInquiriesByStatus(Long vendorId, InquiryStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PropertyInquiry> inquiries = inquiryRepository.findByVendorIdAndStatus(vendorId, status, pageable);
        return inquiries.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyInquiryDTO> getAllInquiries(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PropertyInquiry> inquiries = inquiryRepository.findAll(pageable);
        return inquiries.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyInquiryDTO> getInquiriesByStatus(InquiryStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PropertyInquiry> inquiries = inquiryRepository.findByStatus(status, pageable);
        return inquiries.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public PropertyInquiryDTO getInquiryById(Long inquiryId) {
        PropertyInquiry inquiry = inquiryRepository.findById(inquiryId)
            .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + inquiryId));
        return mapToDTO(inquiry);
    }
    
    @Transactional
    public PropertyInquiryDTO markAsRead(Long inquiryId) {
        log.info("Marking inquiry as read: {}", inquiryId);
        
        PropertyInquiry inquiry = inquiryRepository.findById(inquiryId)
            .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + inquiryId));
        
        if (inquiry.getStatus() == InquiryStatus.NEW) {
            inquiry.setStatus(InquiryStatus.READ);
            PropertyInquiry updatedInquiry = inquiryRepository.save(inquiry);
            return mapToDTO(updatedInquiry);
        }
        
        return mapToDTO(inquiry);
    }
    
    @Transactional
    public PropertyInquiryDTO updateStatus(Long inquiryId, InquiryStatus status) {
        log.info("Updating inquiry status: {} to {}", inquiryId, status);
        
        PropertyInquiry inquiry = inquiryRepository.findById(inquiryId)
            .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + inquiryId));
        
        inquiry.setStatus(status);
        PropertyInquiry updatedInquiry = inquiryRepository.save(inquiry);
        
        return mapToDTO(updatedInquiry);
    }
    
    @Transactional(readOnly = true)
    public Long countNewInquiriesForVendor(Long vendorId) {
        return inquiryRepository.countNewInquiriesByVendor(vendorId);
    }
    
    @Transactional(readOnly = true)
    public Long countNewInquiries() {
        return inquiryRepository.countByStatus(InquiryStatus.NEW);
    }
    
    private PropertyInquiryDTO mapToDTO(PropertyInquiry inquiry) {
        return PropertyInquiryDTO.builder()
            .id(inquiry.getId())
            .propertyId(inquiry.getPropertyId())
            .userId(inquiry.getUserId())
            .name(inquiry.getName())
            .email(inquiry.getEmail())
            .phone(inquiry.getPhone())
            .message(inquiry.getMessage())
            .status(inquiry.getStatus())
            .vendorId(inquiry.getVendorId())
            .propertyTitle(inquiry.getPropertyTitle())
            .createdAt(inquiry.getCreatedAt())
            .updatedAt(inquiry.getUpdatedAt())
            .build();
    }
}
