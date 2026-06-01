package com.globalhub.vendor.repository;

import com.globalhub.vendor.entity.Vendor;
import com.globalhub.vendor.entity.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByUserId(Long userId);
    List<Vendor> findByStatus(VendorStatus status);
    List<Vendor> findByBusinessType(String businessType);
    boolean existsByUserId(Long userId);
}
