package com.globalhub.property.repository;

import com.globalhub.property.entity.Property;
import com.globalhub.property.entity.PropertyStatus;
import com.globalhub.property.entity.PropertyType;
import com.globalhub.property.entity.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    Page<Property> findByVendorId(Long vendorId, Pageable pageable);
    
    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);
    
    Page<Property> findByCounty(String county, Pageable pageable);
    
    Page<Property> findByPropertyType(PropertyType propertyType, Pageable pageable);
    
    Page<Property> findByListingType(ListingType listingType, Pageable pageable);
    
    @Query("SELECT p FROM Property p WHERE p.status = :status " +
           "AND (:county IS NULL OR p.county = :county) " +
           "AND (:propertyType IS NULL OR p.propertyType = :propertyType) " +
           "AND (:listingType IS NULL OR p.listingType = :listingType) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Property> findActivePropertiesWithFilters(
        @Param("status") PropertyStatus status,
        @Param("county") String county,
        @Param("propertyType") PropertyType propertyType,
        @Param("listingType") ListingType listingType,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );
    
    @Query("SELECT p FROM Property p WHERE p.status = 'ACTIVE' " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.county) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Property> searchActiveProperties(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Property p WHERE p.vendorId = :vendorId AND p.status = :status")
    long countByVendorIdAndStatus(@Param("vendorId") Long vendorId, @Param("status") PropertyStatus status);
    
    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = :status")
    long countByStatus(@Param("status") PropertyStatus status);
}