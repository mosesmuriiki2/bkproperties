# Product Image Upload Implementation Guide

## Overview

This guide explains how to upload product images, save them to the backend, store paths in the database, and fetch them from the frontend.

---

## What Was Implemented

### 1. FileStorageService
- Handles file upload and storage
- Validates file type (images only)
- Validates file size (max 10MB)
- Generates unique filenames using UUID
- Stores files in `uploads/products/` directory
- Returns file path for database storage

### 2. ProductService Updates
- `uploadProductImage()` - Upload single image
- `uploadProductImages()` - Upload multiple images
- `removeProductImage()` - Delete image from product

### 3. ProductController Updates
- `POST /api/products/{id}/images` - Upload single image
- `POST /api/products/{id}/images/multiple` - Upload multiple images
- `DELETE /api/products/{id}/images` - Remove image

### 4. Database Schema
- `product_images` table stores image paths
- Images are stored as a collection in the Product entity
- Paths are persisted to database automatically

### 5. File Serving
- WebConfig serves uploaded files at `/uploads/**`
- Files are accessible via HTTP

---

## How to Use

### Step 1: Create a Product

```bash
curl -X POST http://localhost:7071/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "vendorId": 1,
    "name": "Product Name",
    "description": "Product Description",
    "category": "Electronics",
    "price": 99.99,
    "stockQuantity": 10
  }'
```

**Response**:
```json
{
  "id": 1,
  "vendorId": 1,
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 99.99,
  "stockQuantity": 10,
  "images": [],
  "status": "ACTIVE",
  "createdAt": "2026-03-10T10:00:00",
  "updatedAt": "2026-03-10T10:00:00"
}
```

### Step 2: Upload Single Image

```bash
curl -X POST http://localhost:7071/api/products/1/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Response**:
```json
{
  "id": 1,
  "vendorId": 1,
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 99.99,
  "stockQuantity": 10,
  "images": ["uploads/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"],
  "status": "ACTIVE",
  "createdAt": "2026-03-10T10:00:00",
  "updatedAt": "2026-03-10T10:05:00"
}
```

### Step 3: Upload Multiple Images

```bash
curl -X POST http://localhost:7071/api/products/1/images/multiple \
  -H "Authorization: Bearer $TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
```

**Response**:
```json
{
  "id": 1,
  "vendorId": 1,
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 99.99,
  "stockQuantity": 10,
  "images": [
    "uploads/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    "uploads/products/b2c3d4e5-f6a7-8901-bcde-f12345678901.jpg",
    "uploads/products/c3d4e5f6-a7b8-9012-cdef-123456789012.jpg"
  ],
  "status": "ACTIVE",
  "createdAt": "2026-03-10T10:00:00",
  "updatedAt": "2026-03-10T10:10:00"
}
```

### Step 4: Fetch Product with Images

```bash
curl -X GET http://localhost:7071/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "id": 1,
  "vendorId": 1,
  "name": "Product Name",
  "description": "Product Description",
  "category": "Electronics",
  "price": 99.99,
  "stockQuantity": 10,
  "images": [
    "uploads/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    "uploads/products/b2c3d4e5-f6a7-8901-bcde-f12345678901.jpg",
    "uploads/products/c3d4e5f6-a7b8-9012-cdef-123456789012.jpg"
  ],
  "status": "ACTIVE",
  "createdAt": "2026-03-10T10:00:00",
  "updatedAt": "2026-03-10T10:10:00"
}
```

### Step 5: Display Images in Frontend

```javascript
// In your React component
import { useEffect, useState } from 'react';
import api from './api/apiClient';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    api.products.getById(productId).then(setProduct);
  }, [productId]);
  
  if (!product) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      
      {/* Display images */}
      <div className="images">
        {product.images && product.images.map((imagePath, index) => (
          <img 
            key={index}
            src={`http://localhost:7071/${imagePath}`}
            alt={`${product.name} ${index + 1}`}
            style={{ maxWidth: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 6: Remove Image

```bash
curl -X DELETE http://localhost:7071/api/products/1/images \
  -H "Authorization: Bearer $TOKEN" \
  -d "imagePath=uploads/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
```

---

## Database Schema

### product_images Table
```sql
CREATE TABLE product_images (
  product_id BIGINT NOT NULL,
  image_url VARCHAR(255),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Data Example
```sql
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'uploads/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg'),
(1, 'uploads/products/b2c3d4e5-f6a7-8901-bcde-f12345678901.jpg'),
(1, 'uploads/products/c3d4e5f6-a7b8-9012-cdef-123456789012.jpg');
```

---

## File Structure

```
backend/globalhub-product-service/
├── src/main/java/com/globalhub/product/
│   ├── config/
│   │   ├── CorsConfig.java
│   │   └── WebConfig.java (NEW - serves uploaded files)
│   ├── controller/
│   │   └── ProductController.java (UPDATED - added image endpoints)
│   ├── service/
│   │   ├── ProductService.java (UPDATED - added image methods)
│   │   └── FileStorageService.java (NEW - handles file storage)
│   ├── entity/
│   │   └── Product.java (has images collection)
│   └── repository/
│       └── ProductRepository.java
├── src/main/resources/
│   └── application.yml (UPDATED - file upload config)
└── uploads/products/ (NEW - stores uploaded files)
```

---

## Configuration

### application.yml
```yaml
# File upload configuration
file:
  upload:
    dir: uploads/products/
    max-size: 10485760  # 10MB in bytes

servlet:
  multipart:
    max-file-size: 10MB
    max-request-size: 10MB
```

---

## API Endpoints

### Upload Single Image
```
POST /api/products/{id}/images
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (required)

Response: ProductDTO with updated images list
```

### Upload Multiple Images
```
POST /api/products/{id}/images/multiple
Content-Type: multipart/form-data

Parameters:
- files: MultipartFile[] (required)

Response: ProductDTO with updated images list
```

### Remove Image
```
DELETE /api/products/{id}/images
Content-Type: application/x-www-form-urlencoded

Parameters:
- imagePath: String (required) - path to remove

Response: ProductDTO with updated images list
```

### Get Product with Images
```
GET /api/products/{id}

Response: ProductDTO with images array
```

### Get All Products with Images
```
GET /api/products

Response: List of ProductDTO with images arrays
```

---

## Frontend Integration

### React Component Example

```jsx
import { useState } from 'react';
import api from './api/apiClient';

export default function ProductImageUpload({ productId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSingleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        `http://localhost:7071/api/products/${productId}/images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        }
      );
      
      if (!response.ok) throw new Error('Upload failed');
      
      const product = await response.json();
      console.log('Image uploaded:', product);
      // Update UI with new product data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMultipleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const response = await fetch(
        `http://localhost:7071/api/products/${productId}/images/multiple`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        }
      );
      
      if (!response.ok) throw new Error('Upload failed');
      
      const product = await response.json();
      console.log('Images uploaded:', product);
      // Update UI with new product data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3>Upload Product Images</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label>Single Image:</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleSingleImageUpload}
          disabled={loading}
        />
      </div>
      
      <div>
        <label>Multiple Images:</label>
        <input 
          type="file" 
          accept="image/*"
          multiple
          onChange={handleMultipleImageUpload}
          disabled={loading}
        />
      </div>
      
      {loading && <p>Uploading...</p>}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: "File is empty"
**Solution**: Ensure file is selected and not empty

### Issue: "Invalid file type"
**Solution**: Only image files are allowed (jpg, png, gif, etc.)

### Issue: "File size exceeds maximum"
**Solution**: Maximum file size is 10MB. Compress image or increase limit in application.yml

### Issue: Images not showing in frontend
**Solution**: 
1. Check image path in database: `SELECT * FROM product_images;`
2. Verify file exists: `ls -la uploads/products/`
3. Check image URL: `http://localhost:7071/uploads/products/filename.jpg`

### Issue: 404 when accessing image
**Solution**: 
1. Verify WebConfig is loaded
2. Check upload directory path in application.yml
3. Ensure file permissions are correct

---

## Testing

### Test with cURL

```bash
# 1. Create product
PRODUCT_ID=$(curl -s -X POST http://localhost:7071/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "vendorId": 1,
    "name": "Test Product",
    "description": "Test",
    "category": "Test",
    "price": 99.99,
    "stockQuantity": 10
  }' | jq -r '.id')

# 2. Upload image
curl -X POST http://localhost:7071/api/products/$PRODUCT_ID/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"

# 3. Get product with images
curl -X GET http://localhost:7071/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"

# 4. View image in browser
# http://localhost:7071/uploads/products/filename.jpg
```

---

## Performance Considerations

1. **Image Compression**: Consider compressing images before upload
2. **CDN**: For production, use CDN to serve images
3. **Database**: Images are stored as paths, not binary data
4. **File System**: Ensure sufficient disk space for uploads
5. **Cleanup**: Implement periodic cleanup of orphaned files

---

## Security Considerations

1. **File Type Validation**: Only images allowed
2. **File Size Limit**: Maximum 10MB per file
3. **Unique Filenames**: UUID prevents filename conflicts
4. **Access Control**: Requires authentication
5. **Path Traversal**: Prevented by UUID filenames

---

## Next Steps

1. ✅ Rebuild product service: `mvn clean package -DskipTests`
2. ✅ Restart product service
3. ✅ Test image upload via Swagger: http://localhost:7075/swagger-ui.html
4. ✅ Verify images in database: `SELECT * FROM product_images;`
5. ✅ Test image display in frontend
6. ✅ Verify images accessible via HTTP

---

**Status**: ✅ Implementation Complete  
**Ready for**: Testing & Integration  
**Last Updated**: March 10, 2026

