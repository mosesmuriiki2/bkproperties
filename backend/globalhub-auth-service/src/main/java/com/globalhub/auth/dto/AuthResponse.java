package com.globalhub.auth.dto;

import com.globalhub.auth.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String accessToken;
    private String refreshToken;
    private String message;
}
