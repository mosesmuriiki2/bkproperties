package com.globalhub.property.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.upload.max-file-size:10485760}") // 10MB default
    private long maxFileSize;
    
    @Value("${app.base-url:http://localhost:9096}")
    private String baseUrl;
    
    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "gif", "webp");
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    
    public List<String> uploadPropertyImages(List<MultipartFile> files, Long propertyId) throws IOException {
        List<String> uploadedUrls = new ArrayList<>();
        
        // Create property-specific directory
        String propertyDir = "properties/" + propertyId;
        Path uploadPath = createUploadDirectory(propertyDir);
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            
            validateFile(file);
            
            String fileName = generateFileName(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            
            // Copy file to upload directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Generate URL for the uploaded file
            String fileUrl = baseUrl + "/api/files/" + propertyDir + "/" + fileName;
            uploadedUrls.add(fileUrl);
            
            log.info("Uploaded property image: {} for property: {}", fileName, propertyId);
        }
        
        return uploadedUrls;
    }
    
    public String uploadVendorDocument(MultipartFile file, Long vendorId, String documentType) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        validateFile(file);
        
        // Create vendor-specific directory
        String vendorDir = "vendors/" + vendorId + "/documents";
        Path uploadPath = createUploadDirectory(vendorDir);
        
        String fileName = documentType + "_" + generateFileName(file.getOriginalFilename());
        Path filePath = uploadPath.resolve(fileName);
        
        // Copy file to upload directory
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Generate URL for the uploaded file
        String fileUrl = baseUrl + "/api/files/" + vendorDir + "/" + fileName;
        
        log.info("Uploaded vendor document: {} for vendor: {}", fileName, vendorId);
        return fileUrl;
    }
    
    public void deleteFile(String fileUrl) {
        try {
            // Extract file path from URL
            String filePath = fileUrl.replace(baseUrl + "/api/files/", "");
            Path fullPath = Paths.get(uploadDir, filePath);
            
            if (Files.exists(fullPath)) {
                Files.delete(fullPath);
                log.info("Deleted file: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", fileUrl, e);
        }
    }
    
    public void deletePropertyImages(List<String> imageUrls) {
        if (imageUrls != null) {
            imageUrls.forEach(this::deleteFile);
        }
    }
    
    private Path createUploadDirectory(String subDir) throws IOException {
        Path uploadPath = Paths.get(uploadDir, subDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        return uploadPath;
    }
    
    private void validateFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }
        
        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("File name is required");
        }
        
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + ALLOWED_EXTENSIONS);
        }
        
        // Check MIME type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only image files are allowed.");
        }
    }
    
    private String generateFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        return timestamp + "_" + uuid + "." + extension;
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}