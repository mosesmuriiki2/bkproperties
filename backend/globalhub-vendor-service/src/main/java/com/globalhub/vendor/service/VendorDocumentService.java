package com.globalhub.vendor.service;

import com.globalhub.vendor.dto.VendorDocumentDTO;
import com.globalhub.vendor.entity.VendorDocument;
import com.globalhub.vendor.repository.VendorDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorDocumentService {
    
    private final VendorDocumentRepository documentRepository;
    
    @Transactional
    public VendorDocumentDTO uploadDocument(Long vendorId, VendorDocumentDTO dto) {
        log.info("Uploading document for vendorId: {}", vendorId);
        
        VendorDocument document = VendorDocument.builder()
            .vendorId(vendorId)
            .documentType(dto.getDocumentType())
            .documentUrl(dto.getDocumentUrl())
            .build();
        
        VendorDocument saved = documentRepository.save(document);
        return mapToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<VendorDocumentDTO> getDocumentsByVendorId(Long vendorId) {
        log.info("Fetching documents for vendorId: {}", vendorId);
        
        return documentRepository.findByVendorId(vendorId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteAllDocumentsByVendorId(Long vendorId) {
        log.info("Deleting all documents for vendorId: {}", vendorId);
        
        List<VendorDocument> documents = documentRepository.findByVendorId(vendorId);
        documentRepository.deleteAll(documents);
    }
    
    private VendorDocumentDTO mapToDTO(VendorDocument document) {
        return VendorDocumentDTO.builder()
            .id(document.getId())
            .vendorId(document.getVendorId())
            .documentType(document.getDocumentType())
            .documentUrl(document.getDocumentUrl())
            .status(document.getStatus())
            .uploadedAt(document.getUploadedAt())
            .build();
    }
}
