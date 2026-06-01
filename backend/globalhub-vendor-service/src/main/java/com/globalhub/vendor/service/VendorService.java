package com.globalhub.vendor.service;

import com.globalhub.vendor.dto.VendorDTO;
import com.globalhub.vendor.entity.Vendor;
import com.globalhub.vendor.entity.VendorStatus;
import com.globalhub.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorService {
    
    private final VendorRepository vendorRepository;
    private final VendorDocumentService documentService;
    
    @Transactional
    public VendorDTO registerVendor(VendorDTO dto) {
        log.info("Registering new vendor: {}", dto.getBusinessName());
        
        if (vendorRepository.existsByUserId(dto.getUserId())) {
            throw new RuntimeException("Vendor already registered for userId: " + dto.getUserId());
        }
        
        Vendor vendor = Vendor.builder()
            .userId(dto.getUserId())
            .businessName(dto.getBusinessName())
            .businessType(dto.getBusinessType())
            .taxNumber(dto.getTaxNumber())
            .licenseNumber(dto.getLicenseNumber())
            .propertyCategory(dto.getPropertyCategory() != null ? 
                com.globalhub.vendor.entity.PropertyCategory.valueOf(dto.getPropertyCategory()) : null)
            .listingType(dto.getListingType() != null ? 
                com.globalhub.vendor.entity.ListingType.valueOf(dto.getListingType()) : null)
            .email(dto.getEmail())
            .phone(dto.getPhone())
            .address(dto.getAddress())
            .county(dto.getCounty())
            .subCounty(dto.getSubCounty())
            .website(dto.getWebsite())
            .description(dto.getDescription())
            .idNumber(dto.getIdNumber())
            .status(VendorStatus.PENDING)
            .build();
        
        Vendor saved = vendorRepository.save(vendor);
        return mapToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public VendorDTO getVendorById(Long vendorId) {
        log.info("Fetching vendor with id: {}", vendorId);
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        
        return mapToDTO(vendor);
    }
    
    @Transactional(readOnly = true)
    public VendorDTO getVendorByUserId(Long userId) {
        log.info("Fetching vendor for userId: {}", userId);
        
        Vendor vendor = vendorRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Vendor not found for userId: " + userId));
        
        return mapToDTO(vendor);
    }
    
    @Transactional(readOnly = true)
    public List<VendorDTO> getAllVendors() {
        log.info("Fetching all vendors");
        
        return vendorRepository.findAll()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<VendorDTO> getVendorsByStatus(VendorStatus status) {
        log.info("Fetching vendors with status: {}", status);
        
        return vendorRepository.findByStatus(status)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public VendorDTO updateVendor(Long vendorId, VendorDTO dto) {
        log.info("Updating vendor with id: {}", vendorId);
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        
        vendor.setBusinessName(dto.getBusinessName());
        vendor.setBusinessType(dto.getBusinessType());
        vendor.setEmail(dto.getEmail());
        vendor.setPhone(dto.getPhone());
        vendor.setAddress(dto.getAddress());
        vendor.setWebsite(dto.getWebsite());
        vendor.setDescription(dto.getDescription());
        
        Vendor updated = vendorRepository.save(vendor);
        return mapToDTO(updated);
    }
    
    @Transactional
    public VendorDTO updateVendorStatus(Long vendorId, VendorStatus status) {
        log.info("Updating vendor status to: {} for vendorId: {}", status, vendorId);
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        
        vendor.setStatus(status);
        Vendor updated = vendorRepository.save(vendor);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteVendor(Long vendorId) {
        log.info("Deleting vendor with id: {}", vendorId);
        
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + vendorId));
        
        // Delete all documents first
        documentService.deleteAllDocumentsByVendorId(vendorId);
        
        // Delete vendor
        vendorRepository.delete(vendor);
    }
    
    private VendorDTO mapToDTO(Vendor vendor) {
        return VendorDTO.builder()
            .id(vendor.getId())
            .userId(vendor.getUserId())
            .businessName(vendor.getBusinessName())
            .businessType(vendor.getBusinessType())
            .taxNumber(vendor.getTaxNumber())
            .licenseNumber(vendor.getLicenseNumber())
            .propertyCategory(vendor.getPropertyCategory() != null ? vendor.getPropertyCategory().name() : null)
            .listingType(vendor.getListingType() != null ? vendor.getListingType().name() : null)
            .status(vendor.getStatus())
            .rating(vendor.getRating())
            .email(vendor.getEmail())
            .phone(vendor.getPhone())
            .address(vendor.getAddress())
            .county(vendor.getCounty())
            .subCounty(vendor.getSubCounty())
            .website(vendor.getWebsite())
            .description(vendor.getDescription())
            .idNumber(vendor.getIdNumber())
            .documents(documentService.getDocumentsByVendorId(vendor.getId()))
            .createdAt(vendor.getCreatedAt())
            .updatedAt(vendor.getUpdatedAt())
            .build();
    }
}
