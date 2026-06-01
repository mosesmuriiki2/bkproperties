package com.globalhub.property.controller;

import com.globalhub.property.dto.PropertyInquiryDTO;
import com.globalhub.property.entity.InquiryStatus;
import com.globalhub.property.service.PropertyInquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PropertyInquiryController {
    
    private final PropertyInquiryService inquiryService;
    
    @PostMapping
    public ResponseEntity<PropertyInquiryDTO> createInquiry(@RequestBody PropertyInquiryDTO inquiryDTO) {
        log.info("POST /api/inquiries - Creating inquiry for property: {}", inquiryDTO.getPropertyId());
        try {
            PropertyInquiryDTO createdInquiry = inquiryService.createInquiry(inquiryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInquiry);
        } catch (Exception e) {
            log.error("Error creating inquiry", e);
            throw new RuntimeException("Failed to create inquiry: " + e.getMessage());
        }
    }
    
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<Page<PropertyInquiryDTO>> getVendorInquiries(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("GET /api/inquiries/vendor/{} - page: {}, size: {}", vendorId, page, size);
        Page<PropertyInquiryDTO> inquiries = inquiryService.getVendorInquiries(vendorId, page, size);
        return ResponseEntity.ok(inquiries);
    }
    
    @GetMapping("/vendor/{vendorId}/status/{status}")
    public ResponseEntity<Page<PropertyInquiryDTO>> getVendorInquiriesByStatus(
            @PathVariable Long vendorId,
            @PathVariable InquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("GET /api/inquiries/vendor/{}/status/{} - page: {}, size: {}", vendorId, status, page, size);
        Page<PropertyInquiryDTO> inquiries = inquiryService.getVendorInquiriesByStatus(vendorId, status, page, size);
        return ResponseEntity.ok(inquiries);
    }
    
    @GetMapping
    public ResponseEntity<Page<PropertyInquiryDTO>> getAllInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("GET /api/inquiries - page: {}, size: {}", page, size);
        Page<PropertyInquiryDTO> inquiries = inquiryService.getAllInquiries(page, size);
        return ResponseEntity.ok(inquiries);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<PropertyInquiryDTO>> getInquiriesByStatus(
            @PathVariable InquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("GET /api/inquiries/status/{} - page: {}, size: {}", status, page, size);
        Page<PropertyInquiryDTO> inquiries = inquiryService.getInquiriesByStatus(status, page, size);
        return ResponseEntity.ok(inquiries);
    }
    
    @GetMapping("/{inquiryId}")
    public ResponseEntity<PropertyInquiryDTO> getInquiryById(@PathVariable Long inquiryId) {
        log.info("GET /api/inquiries/{}", inquiryId);
        PropertyInquiryDTO inquiry = inquiryService.getInquiryById(inquiryId);
        return ResponseEntity.ok(inquiry);
    }
    
    @PutMapping("/{inquiryId}/read")
    public ResponseEntity<PropertyInquiryDTO> markAsRead(@PathVariable Long inquiryId) {
        log.info("PUT /api/inquiries/{}/read", inquiryId);
        PropertyInquiryDTO inquiry = inquiryService.markAsRead(inquiryId);
        return ResponseEntity.ok(inquiry);
    }
    
    @PutMapping("/{inquiryId}/status")
    public ResponseEntity<PropertyInquiryDTO> updateStatus(
            @PathVariable Long inquiryId,
            @RequestParam InquiryStatus status) {
        log.info("PUT /api/inquiries/{}/status - status: {}", inquiryId, status);
        PropertyInquiryDTO inquiry = inquiryService.updateStatus(inquiryId, status);
        return ResponseEntity.ok(inquiry);
    }
    
    @GetMapping("/vendor/{vendorId}/count/new")
    public ResponseEntity<Long> countNewInquiriesForVendor(@PathVariable Long vendorId) {
        log.info("GET /api/inquiries/vendor/{}/count/new", vendorId);
        Long count = inquiryService.countNewInquiriesForVendor(vendorId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/new")
    public ResponseEntity<Long> countNewInquiries() {
        log.info("GET /api/inquiries/count/new");
        Long count = inquiryService.countNewInquiries();
        return ResponseEntity.ok(count);
    }
}
