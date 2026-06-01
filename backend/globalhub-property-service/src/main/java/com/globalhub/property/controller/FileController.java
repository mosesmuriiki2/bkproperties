package com.globalhub.property.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@Slf4j
public class FileController {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(@RequestParam String filename) {
        try {
            // Extract the full path from the request
            String requestPath = filename;
            Path filePath = Paths.get(uploadDir).resolve(requestPath).normalize();
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                log.warn("File not found or not readable: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("Error serving file: {}", filename, e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/properties/{propertyId}/{filename}")
    public ResponseEntity<Resource> servePropertyImage(
            @PathVariable Long propertyId,
            @PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "properties", propertyId.toString(), filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
            } else {
                log.warn("Property image not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("Error serving property image: {}/{}", propertyId, filename, e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/vendors/{vendorId}/documents/{filename}")
    public ResponseEntity<Resource> serveVendorDocument(
            @PathVariable Long vendorId,
            @PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, "vendors", vendorId.toString(), "documents", filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
            } else {
                log.warn("Vendor document not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("Error serving vendor document: {}/{}", vendorId, filename, e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    private String determineContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> "application/octet-stream";
        };
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}