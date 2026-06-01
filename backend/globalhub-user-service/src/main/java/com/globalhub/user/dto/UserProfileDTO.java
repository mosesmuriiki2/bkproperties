package com.globalhub.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String phone;
    private String avatar;
    private String bio;
    private List<AddressDTO> addresses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
