package com.globalhub.property.controller;

import com.globalhub.property.dto.PropertyDTO;
import com.globalhub.property.entity.PropertyType;
import com.globalhub.property.entity.ListingType;
import com.globalhub.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Property Management", description = "APIs for managing properties")
public class PropertyController {
    
    private final PropertyService propertyService;
    
    @PostMapping(consumes = {"multipart/form-data"})
    @Operation(summary = "Create new property with images")
    public ResponseEntity<PropertyDTO> createProperty(
            @RequestPart("property") PropertyDTO dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(propertyService.createProperty(dto, images));
    }
    
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @Operation(summary = "Update property with new images")
    public ResponseEntity<PropertyDTO> updateProperty(
            @PathVariable Long id,
            @RequestPart("property") PropertyDTO dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto, images));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get property by ID")
    public ResponseEntity<PropertyDTO> getProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
    
    @GetMapping
    @Operation(summary = "Get all properties with pagination and filters (Admin)")
    public ResponseEntity<Page<PropertyDTO>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(propertyService.getAllProperties(page, size, status));
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get active properties with pagination and filters")
    public ResponseEntity<Page<PropertyDTO>> getActiveProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String county,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(propertyService.getActiveProperties(page, size, county, propertyType, listingType, minPrice, maxPrice));
    }
    
    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get properties by vendor with pagination")
    public ResponseEntity<Page<PropertyDTO>> getVendorProperties(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getVendorProperties(vendorId, page, size));
    }
    
    @GetMapping("/pending")
    @Operation(summary = "Get pending properties for admin approval")
    public ResponseEntity<Page<PropertyDTO>> getPendingProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getPendingProperties(page, size));
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Change property status (Admin only)")
    public ResponseEntity<PropertyDTO> changePropertyStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(propertyService.changePropertyStatus(id, status));
    }
    
    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve property (Admin only)")
    public ResponseEntity<PropertyDTO> approveProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.approveProperty(id));
    }
    
    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject property (Admin only)")
    public ResponseEntity<PropertyDTO> rejectProperty(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(propertyService.rejectProperty(id, reason));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete property")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}
