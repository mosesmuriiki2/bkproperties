package com.globalhub.vendor.dto;

import com.globalhub.vendor.entity.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorDocumentDTO {
    private Long id;
    private Long vendorId;
    private String documentType;
    private String documentUrl;
    private DocumentStatus status;
    private LocalDateTime uploadedAt;
}
