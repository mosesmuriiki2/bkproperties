package com.globalhub.vendor.controller;

import com.globalhub.vendor.dto.VendorDTO;
import com.globalhub.vendor.dto.VendorDocumentDTO;
import com.globalhub.vendor.entity.VendorStatus;
import com.globalhub.vendor.service.VendorDocumentService;
import com.globalhub.vendor.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendor Management", description = "APIs for managing vendors")
public class VendorController {
    
    private final VendorService vendorService;
    private final VendorDocumentService documentService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new vendor")
    public ResponseEntity<VendorDTO> registerVendor(@RequestBody VendorDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(vendorService.registerVendor(dto));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get vendor by ID")
    public ResponseEntity<VendorDTO> getVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get vendor by user ID")
    public ResponseEntity<VendorDTO> getVendorByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(vendorService.getVendorByUserId(userId));
    }
    
    @GetMapping
    @Operation(summary = "Get all vendors")
    public ResponseEntity<?> getAllVendors(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "50") int size) {
        
        List<VendorDTO> vendors = vendorService.getAllVendors();
        
        // Return paginated response format
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", vendors);
        response.put("totalElements", vendors.size());
        response.put("totalPages", 1);
        response.put("size", vendors.size());
        response.put("number", 0);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get vendors by status")
    public ResponseEntity<List<VendorDTO>> getVendorsByStatus(@PathVariable VendorStatus status) {
        return ResponseEntity.ok(vendorService.getVendorsByStatus(status));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update vendor")
    public ResponseEntity<VendorDTO> updateVendor(
        @PathVariable Long id,
        @RequestBody VendorDTO dto) {
        return ResponseEntity.ok(vendorService.updateVendor(id, dto));
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update vendor status")
    public ResponseEntity<VendorDTO> updateVendorStatus(
        @PathVariable Long id,
        @RequestParam VendorStatus status) {
        return ResponseEntity.ok(vendorService.updateVendorStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vendor")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{vendorId}/documents")
    @Operation(summary = "Upload vendor document")
    public ResponseEntity<VendorDocumentDTO> uploadDocument(
        @PathVariable Long vendorId,
        @RequestBody VendorDocumentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(documentService.uploadDocument(vendorId, dto));
    }
    
    @PostMapping("/{vendorId}/documents/upload")
    @Operation(summary = "Upload vendor document files")
    public ResponseEntity<String> uploadDocumentFiles(
        @PathVariable Long vendorId,
        @RequestParam(value = "idDocument", required = false) org.springframework.web.multipart.MultipartFile idDocument,
        @RequestParam(value = "businessLicense", required = false) org.springframework.web.multipart.MultipartFile businessLicense) {
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get("uploads/vendor-documents");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Upload ID document
            if (idDocument != null && !idDocument.isEmpty()) {
                String idFileName = vendorId + "_id_" + java.util.UUID.randomUUID() + getFileExtension(idDocument.getOriginalFilename());
                Path idFilePath = uploadPath.resolve(idFileName);
                Files.copy(idDocument.getInputStream(), idFilePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                VendorDocumentDTO idDoc = VendorDocumentDTO.builder()
                    .vendorId(vendorId)
                    .documentType("ID_PASSPORT")
                    .documentUrl("/uploads/vendor-documents/" + idFileName)
                    .build();
                documentService.uploadDocument(vendorId, idDoc);
            }
            
            // Upload business license
            if (businessLicense != null && !businessLicense.isEmpty()) {
                String licenseFileName = vendorId + "_license_" + java.util.UUID.randomUUID() + getFileExtension(businessLicense.getOriginalFilename());
                Path licenseFilePath = uploadPath.resolve(licenseFileName);
                Files.copy(businessLicense.getInputStream(), licenseFilePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                VendorDocumentDTO licenseDoc = VendorDocumentDTO.builder()
                    .vendorId(vendorId)
                    .documentType("BUSINESS_LICENSE")
                    .documentUrl("/uploads/vendor-documents/" + licenseFileName)
                    .build();
                documentService.uploadDocument(vendorId, licenseDoc);
            }
            
            return ResponseEntity.ok("Documents uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload documents: " + e.getMessage());
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
    }
    
    @GetMapping("/{vendorId}/documents")
    @Operation(summary = "Get vendor documents")
    public ResponseEntity<List<VendorDocumentDTO>> getDocuments(@PathVariable Long vendorId) {
        return ResponseEntity.ok(documentService.getDocumentsByVendorId(vendorId));
    }
    
    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve vendor")
    public ResponseEntity<VendorDTO> approveVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.updateVendorStatus(id, VendorStatus.APPROVED));
    }
    
    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject vendor")
    public ResponseEntity<VendorDTO> rejectVendor(
        @PathVariable Long id,
        @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(vendorService.updateVendorStatus(id, VendorStatus.REJECTED));
    }
}
