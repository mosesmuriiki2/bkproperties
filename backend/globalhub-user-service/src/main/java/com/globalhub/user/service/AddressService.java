package com.globalhub.user.service;

import com.globalhub.user.dto.AddressDTO;
import com.globalhub.user.entity.Address;
import com.globalhub.user.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {
    
    private final AddressRepository addressRepository;
    
    @Transactional
    public AddressDTO addAddress(Long userId, AddressDTO dto) {
        log.info("Adding address for userId: {}", userId);
        
        // If this is the first address or marked as default, set it as default
        boolean isDefault = dto.isDefault() || addressRepository.findByUserId(userId).isEmpty();
        
        // If setting as default, unset other defaults
        if (isDefault) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(addr -> {
                    addr.setDefault(false);
                    addressRepository.save(addr);
                });
        }
        
        Address address = Address.builder()
            .userId(userId)
            .type(dto.getType())
            .label(dto.getLabel())
            .street(dto.getStreet())
            .apartment(dto.getApartment())
            .city(dto.getCity())
            .state(dto.getState())
            .postalCode(dto.getPostalCode())
            .country(dto.getCountry())
            .latitude(dto.getLatitude())
            .longitude(dto.getLongitude())
            .isDefault(isDefault)
            .build();
        
        Address saved = addressRepository.save(address);
        return mapToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<AddressDTO> getAddressesByUserId(Long userId) {
        log.info("Fetching addresses for userId: {}", userId);
        
        return addressRepository.findByUserId(userId)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public AddressDTO getAddressById(Long addressId) {
        log.info("Fetching address with id: {}", addressId);
        
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
        
        return mapToDTO(address);
    }
    
    @Transactional
    public AddressDTO updateAddress(Long addressId, AddressDTO dto) {
        log.info("Updating address with id: {}", addressId);
        
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
        
        address.setType(dto.getType());
        address.setLabel(dto.getLabel());
        address.setStreet(dto.getStreet());
        address.setApartment(dto.getApartment());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setLatitude(dto.getLatitude());
        address.setLongitude(dto.getLongitude());
        
        // Handle default address
        if (dto.isDefault() && !address.isDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(address.getUserId())
                .ifPresent(addr -> {
                    addr.setDefault(false);
                    addressRepository.save(addr);
                });
            address.setDefault(true);
        }
        
        Address updated = addressRepository.save(address);
        return mapToDTO(updated);
    }
    
    @Transactional
    public void deleteAddress(Long addressId) {
        log.info("Deleting address with id: {}", addressId);
        
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
        
        addressRepository.delete(address);
    }
    
    @Transactional
    public void deleteAllAddressesByUserId(Long userId) {
        log.info("Deleting all addresses for userId: {}", userId);
        
        List<Address> addresses = addressRepository.findByUserId(userId);
        addressRepository.deleteAll(addresses);
    }
    
    private AddressDTO mapToDTO(Address address) {
        return AddressDTO.builder()
            .id(address.getId())
            .userId(address.getUserId())
            .type(address.getType())
            .label(address.getLabel())
            .street(address.getStreet())
            .apartment(address.getApartment())
            .city(address.getCity())
            .state(address.getState())
            .postalCode(address.getPostalCode())
            .country(address.getCountry())
            .latitude(address.getLatitude())
            .longitude(address.getLongitude())
            .isDefault(address.isDefault())
            .createdAt(address.getCreatedAt())
            .build();
    }
}
