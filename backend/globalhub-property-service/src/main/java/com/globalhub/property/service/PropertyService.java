package com.globalhub.property.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globalhub.property.dto.PropertyDTO;
import com.globalhub.property.entity.Property;
import com.globalhub.property.entity.PropertyStatus;
import com.globalhub.property.entity.PropertyType;
import com.globalhub.property.entity.ListingType;
import com.globalhub.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {
    
    private final PropertyRepository propertyRepository;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;
    
    @Transactional
    public PropertyDTO createProperty(PropertyDTO propertyDTO, List<MultipartFile> images) throws IOException {
        log.info("Creating new property: {} for vendor: {}", propertyDTO.getTitle(), propertyDTO.getVendorId());
        
        // Create property entity
        Property property = Property.builder()
            .vendorId(propertyDTO.getVendorId())
            .title(propertyDTO.getTitle())
            .description(propertyDTO.getDescription())
            .propertyType(propertyDTO.getPropertyType())
            .listingType(propertyDTO.getListingType())
            .price(propertyDTO.getPrice())
            .currency("KSH")
            .bedrooms(propertyDTO.getBedrooms())
            .bathrooms(propertyDTO.getBathrooms())
            .areaSqm(propertyDTO.getAreaSqm())
            .landSizeSqm(propertyDTO.getLandSizeSqm())
            .address(propertyDTO.getAddress())
            .county(propertyDTO.getCounty())
            .subCounty(propertyDTO.getSubCounty())
            .latitude(propertyDTO.getLatitude())
            .longitude(propertyDTO.getLongitude())
            .features(listToJson(propertyDTO.getFeatures()))
            .amenities(listToJson(propertyDTO.getAmenities()))
            .status(PropertyStatus.DRAFT)
            .viewsCount(0)
            .build();
        
        // Save property first to get ID
        Property savedProperty = propertyRepository.save(property);
        
        // Upload images if provided
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            imageUrls = fileStorageService.uploadPropertyImages(images, savedProperty.getId());
            savedProperty.setImages(listToJson(imageUrls));
            savedProperty = propertyRepository.save(savedProperty);
        }
        
        log.info("Property created successfully with ID: {}", savedProperty.getId());
        
        // TODO: Send email notification to vendor
        // emailService.sendPropertyListingEmail(vendorEmail, vendorName, property.getTitle(), property.getId().toString());
        
        return mapToDTO(savedProperty);
    }
    
    @Transactional
    public PropertyDTO updateProperty(Long propertyId, PropertyDTO propertyDTO, List<MultipartFile> newImages) throws IOException {
        log.info("Updating property: {}", propertyId);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        // Update property fields
        property.setTitle(propertyDTO.getTitle());
        property.setDescription(propertyDTO.getDescription());
        property.setPropertyType(propertyDTO.getPropertyType());
        property.setListingType(propertyDTO.getListingType());
        property.setPrice(propertyDTO.getPrice());
        property.setBedrooms(propertyDTO.getBedrooms());
        property.setBathrooms(propertyDTO.getBathrooms());
        property.setAreaSqm(propertyDTO.getAreaSqm());
        property.setLandSizeSqm(propertyDTO.getLandSizeSqm());
        property.setAddress(propertyDTO.getAddress());
        property.setCounty(propertyDTO.getCounty());
        property.setSubCounty(propertyDTO.getSubCounty());
        property.setLatitude(propertyDTO.getLatitude());
        property.setLongitude(propertyDTO.getLongitude());
        property.setFeatures(listToJson(propertyDTO.getFeatures()));
        property.setAmenities(listToJson(propertyDTO.getAmenities()));
        
        // Handle new images
        if (newImages != null && !newImages.isEmpty()) {
            // Delete old images
            List<String> oldImages = jsonToList(property.getImages());
            fileStorageService.deletePropertyImages(oldImages);
            
            // Upload new images
            List<String> newImageUrls = fileStorageService.uploadPropertyImages(newImages, propertyId);
            property.setImages(listToJson(newImageUrls));
        }
        
        Property updatedProperty = propertyRepository.save(property);
        log.info("Property updated successfully: {}", propertyId);
        
        return mapToDTO(updatedProperty);
    }
    
    @Transactional
    public PropertyDTO changePropertyStatus(Long propertyId, String status) {
        log.info("Changing property status: {} to {}", propertyId, status);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        PropertyStatus newStatus;
        try {
            newStatus = PropertyStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        property.setStatus(newStatus);
        Property savedProperty = propertyRepository.save(property);
        
        log.info("Property status changed successfully: {} -> {}", propertyId, newStatus);
        return mapToDTO(savedProperty);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getAllProperties(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> properties;
        
        if (status != null && !status.isEmpty()) {
            try {
                PropertyStatus propertyStatus = PropertyStatus.valueOf(status.toUpperCase());
                properties = propertyRepository.findByStatus(propertyStatus, pageable);
            } catch (IllegalArgumentException e) {
                // If invalid status, return all
                properties = propertyRepository.findAll(pageable);
            }
        } else {
            properties = propertyRepository.findAll(pageable);
        }
        
        return properties.map(this::mapToDTO);
    }
    
    @Transactional
    public PropertyDTO approveProperty(Long propertyId) {
        log.info("Approving property: {}", propertyId);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        property.setStatus(PropertyStatus.ACTIVE);
        Property approvedProperty = propertyRepository.save(property);
        
        log.info("Property approved successfully: {}", propertyId);
        
        // TODO: Send approval email to vendor
        // emailService.sendPropertyApprovalEmail(vendorEmail, vendorName, property.getTitle());
        
        return mapToDTO(approvedProperty);
    }
    
    @Transactional
    public PropertyDTO rejectProperty(Long propertyId, String reason) {
        log.info("Rejecting property: {} with reason: {}", propertyId, reason);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        property.setStatus(PropertyStatus.INACTIVE);
        Property rejectedProperty = propertyRepository.save(property);
        
        log.info("Property rejected successfully: {}", propertyId);
        
        // TODO: Send rejection email to vendor with reason
        
        return mapToDTO(rejectedProperty);
    }
    
    @Transactional(readOnly = true)
    public PropertyDTO getPropertyById(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        // Increment view count
        property.setViewsCount(property.getViewsCount() + 1);
        propertyRepository.save(property);
        
        return mapToDTO(property);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getActiveProperties(int page, int size, String county, PropertyType propertyType, 
                                               ListingType listingType, BigDecimal minPrice, BigDecimal maxPrice) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<Property> properties = propertyRepository.findActivePropertiesWithFilters(
            PropertyStatus.ACTIVE, county, propertyType, listingType, minPrice, maxPrice, pageable);
        
        return properties.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getVendorProperties(Long vendorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> properties = propertyRepository.findByVendorId(vendorId, pageable);
        
        return properties.map(this::mapToDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getPendingProperties(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Property> properties = propertyRepository.findByStatus(PropertyStatus.DRAFT, pageable);
        
        return properties.map(this::mapToDTO);
    }
    
    @Transactional
    public void deleteProperty(Long propertyId) {
        log.info("Deleting property: {}", propertyId);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        
        // Delete associated images
        List<String> images = jsonToList(property.getImages());
        fileStorageService.deletePropertyImages(images);
        
        propertyRepository.delete(property);
        log.info("Property deleted successfully: {}", propertyId);
    }
    
    private PropertyDTO mapToDTO(Property property) {
        return PropertyDTO.builder()
            .id(property.getId())
            .vendorId(property.getVendorId())
            .title(property.getTitle())
            .description(property.getDescription())
            .propertyType(property.getPropertyType())
            .listingType(property.getListingType())
            .price(property.getPrice())
            .currency(property.getCurrency())
            .formattedPrice(formatPrice(property.getPrice(), property.getCurrency()))
            .bedrooms(property.getBedrooms())
            .bathrooms(property.getBathrooms())
            .areaSqm(property.getAreaSqm())
            .landSizeSqm(property.getLandSizeSqm())
            .address(property.getAddress())
            .county(property.getCounty())
            .subCounty(property.getSubCounty())
            .latitude(property.getLatitude())
            .longitude(property.getLongitude())
            .features(jsonToList(property.getFeatures()))
            .amenities(jsonToList(property.getAmenities()))
            .images(jsonToList(property.getImages()))
            .status(property.getStatus())
            .viewsCount(property.getViewsCount())
            .createdAt(property.getCreatedAt())
            .updatedAt(property.getUpdatedAt())
            .build();
    }
    
    private String formatPrice(BigDecimal price, String currency) {
        if (price == null) return "";
        
        NumberFormat formatter = NumberFormat.getNumberInstance(Locale.US);
        return "KSh " + formatter.format(price);
    }
    
    private String listToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.error("Error converting list to JSON", e);
            return "[]";
        }
    }
    
    private List<String> jsonToList(String json) {
        if (json == null || json.trim().isEmpty() || "[]".equals(json.trim())) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON to list", e);
            return new ArrayList<>();
        }
    }
}