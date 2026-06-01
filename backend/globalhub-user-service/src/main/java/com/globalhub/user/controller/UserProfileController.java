package com.globalhub.user.controller;

import com.globalhub.user.dto.UserProfileDTO;
import com.globalhub.user.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile Management", description = "APIs for managing user profiles")
public class UserProfileController {
    
    private final UserProfileService userProfileService;
    
    @PostMapping("/{userId}/profile")
    @Operation(summary = "Create user profile")
    public ResponseEntity<UserProfileDTO> createProfile(
        @PathVariable Long userId,
        @RequestBody UserProfileDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userProfileService.createProfile(userId, dto));
    }
    
    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile by ID")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userProfileService.getProfileByUserId(userId));
    }
    
    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
        @PathVariable Long userId,
        @RequestBody UserProfileDTO dto) {
        return ResponseEntity.ok(userProfileService.updateProfile(userId, dto));
    }
    
    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete user profile")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long userId) {
        userProfileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }
}
