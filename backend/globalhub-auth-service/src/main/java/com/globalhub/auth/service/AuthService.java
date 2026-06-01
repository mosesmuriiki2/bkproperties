package com.globalhub.auth.service;

import com.globalhub.auth.dto.LoginRequest;
import com.globalhub.auth.dto.RegisterRequest;
import com.globalhub.auth.dto.AuthResponse;
import com.globalhub.auth.entity.User;
import com.globalhub.auth.entity.UserRole;
import com.globalhub.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    // In-memory OTP storage (use Redis in production)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {} and role: {}", request.getEmail(), request.getRole());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Default to CONSUMER if role not specified
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.CONSUMER;
        
        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phone(request.getPhone())
            .role(role)
            .isVerified(false)
            .isActive(true)
            .build();
        
        User savedUser = userRepository.save(user);
        
        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        
        return AuthResponse.builder()
            .userId(savedUser.getId())
            .email(savedUser.getEmail())
            .firstName(savedUser.getFirstName())
            .lastName(savedUser.getLastName())
            .role(savedUser.getRole())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .message("User registered successfully")
            .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        if (!user.isActive()) {
            throw new RuntimeException("User account is inactive");
        }
        
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .message("Login successful")
            .build();
    }
    
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        
        if (!jwtService.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newAccessToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .accessToken(newAccessToken)
            .refreshToken(refreshToken)
            .message("Token refreshed successfully")
            .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse validateToken(String token) {
        log.info("Validating token");
        
        if (!jwtService.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return AuthResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .message("Token is valid")
            .build();
    }
    
    @Transactional
    public void sendOTP(String email) {
        log.info("Sending OTP to email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        
        // Store OTP (expires in 10 minutes - implement expiry in production)
        otpStore.put(email, otp);
        
        // Log OTP for development (send via email in production)
        log.info("OTP for {}: {}", email, otp);
        
        // TODO: Send OTP via email service
        // emailService.sendOTPEmail(email, user.getFirstName(), otp);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse verifyOTP(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);
        
        String storedOTP = otpStore.get(email);
        if (storedOTP == null || !storedOTP.equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        // Remove OTP after successful verification
        otpStore.remove(email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        return AuthResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .message("OTP verified successfully")
            .build();
    }
}
