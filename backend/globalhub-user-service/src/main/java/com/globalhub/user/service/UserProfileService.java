package com.globalhub.user.service;

import com.globalhub.user.dto.UserProfileDTO;
import com.globalhub.user.entity.UserProfile;
import com.globalhub.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {
    
    private final UserProfileRepository userProfileRepository;
    private final AddressService addressService;
    
    @Transactional
    public UserProfileDTO createProfile(Long userId, UserProfileDTO dto) {
        log.info("Creating user profile for userId: {}", userId);
        
        if (userProfileRepository.existsByUserId(userId)) {
            throw new RuntimeException("User profile already exists for userId: " + userId);
        }
        
        UserProfile profile = UserProfile.builder()
            .userId(userId)
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .phone(dto.getPhone())
            .avatar(dto.getAvatar())
            .bio(dto.getBio())
            .build();
        
        UserProfile saved = userProfileRepository.save(profile);
        return mapToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public UserProfileDTO getProfileByUserId(Long userId) {
        log.info("Fetching user profile for userId: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User profile not found for userId: " + userId));
        
        return mapToDTO(profile);
    }
    
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UserProfileDTO dto) {
        log.info("Updating user profile for userId: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User profile not found for userId: " + userId));
        
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setPhone(dto.getPhone());
        profile.setAvatar(dto.getAvatar());
        profile.setBio(dto.getBio());
        
        UserProfile updated = userProfileRepository.save(profile);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteProfile(Long userId) {
        log.info("Deleting user profile for userId: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User profile not found for userId: " + userId));
        
        // Delete all addresses first
        addressService.deleteAllAddressesByUserId(userId);
        
        // Delete profile
        userProfileRepository.delete(profile);
    }
    
    private UserProfileDTO mapToDTO(UserProfile profile) {
        return UserProfileDTO.builder()
            .id(profile.getId())
            .userId(profile.getUserId())
            .firstName(profile.getFirstName())
            .lastName(profile.getLastName())
            .phone(profile.getPhone())
            .avatar(profile.getAvatar())
            .bio(profile.getBio())
            .addresses(addressService.getAddressesByUserId(profile.getUserId()))
            .createdAt(profile.getCreatedAt())
            .updatedAt(profile.getUpdatedAt())
            .build();
    }
}
