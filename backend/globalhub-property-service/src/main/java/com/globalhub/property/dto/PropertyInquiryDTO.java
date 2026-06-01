package com.globalhub.property.dto;

import com.globalhub.property.entity.InquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyInquiryDTO {
    
    private Long id;
    private Long propertyId;
    private Long userId;
    
    private String name;
    private String email;
    private String phone;
    private String message;
    
    private InquiryStatus status;
    
    private Long vendorId;
    private String propertyTitle;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
