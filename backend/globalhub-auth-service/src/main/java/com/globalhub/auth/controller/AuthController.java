package com.globalhub.auth.controller;

import com.globalhub.auth.dto.AuthResponse;
import com.globalhub.auth.dto.LoginRequest;
import com.globalhub.auth.dto.RegisterRequest;
import com.globalhub.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "APIs for user authentication and authorization")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user and get tokens")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        log.info("Token refresh request");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate")
    @Operation(summary = "Validate access token")
    public ResponseEntity<AuthResponse> validateToken(@RequestParam String token) {
        log.info("Token validation request");
        AuthResponse response = authService.validateToken(token);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to user email")
    public ResponseEntity<String> sendOTP(@RequestBody OTPRequest request) {
        log.info("OTP request for email: {}", request.getEmail());
        authService.sendOTP(request.getEmail());
        return ResponseEntity.ok("OTP sent successfully");
    }
    
    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and login")
    public ResponseEntity<AuthResponse> verifyOTP(@RequestBody OTPVerifyRequest request) {
        log.info("OTP verification for email: {}", request.getEmail());
        AuthResponse response = authService.verifyOTP(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(response);
    }
}

// DTO classes
class OTPRequest {
    private String email;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

class OTPVerifyRequest {
    private String email;
    private String otp;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
