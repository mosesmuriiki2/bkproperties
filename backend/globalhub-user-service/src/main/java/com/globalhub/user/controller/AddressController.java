package com.globalhub.user.controller;

import com.globalhub.user.dto.AddressDTO;
import com.globalhub.user.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Address Management", description = "APIs for managing user addresses")
public class AddressController {
    
    private final AddressService addressService;
    
    @PostMapping("/{userId}/addresses")
    @Operation(summary = "Add new address for user")
    public ResponseEntity<AddressDTO> addAddress(
        @PathVariable Long userId,
        @RequestBody AddressDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(addressService.addAddress(userId, dto));
    }
    
    @GetMapping("/{userId}/addresses")
    @Operation(summary = "Get all addresses for user")
    public ResponseEntity<List<AddressDTO>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }
    
    @GetMapping("/addresses/{addressId}")
    @Operation(summary = "Get address by ID")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.getAddressById(addressId));
    }
    
    @PutMapping("/addresses/{addressId}")
    @Operation(summary = "Update address")
    public ResponseEntity<AddressDTO> updateAddress(
        @PathVariable Long addressId,
        @RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, dto));
    }
    
    @DeleteMapping("/addresses/{addressId}")
    @Operation(summary = "Delete address")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.noContent().build();
    }
}
