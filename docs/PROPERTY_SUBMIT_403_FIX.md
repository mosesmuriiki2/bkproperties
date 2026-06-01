# Property Submit 403 Forbidden Error Fix

## Problem
When vendors try to submit properties, they get a **403 Forbidden** error:
```
Error submitting property: Error: Forbidden
```

## Root Cause
The **globalhub-property-service** has `spring-boot-starter-security` dependency in its `pom.xml` but **NO SecurityConfig class**.

When Spring Security is present without configuration, it uses **default security** which:
- Blocks ALL endpoints by default
- Requires authentication for every request
- Returns 403 Forbidden for unauthorized requests

## Solution
Created `SecurityConfig.java` for the property service to allow all property endpoints.

### File Created
**`backend/globalhub-property-service/src/main/java/com/globalhub/property/config/SecurityConfig.java`**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/properties/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}
```

### Configuration Details
- **CSRF disabled**: Not needed for stateless REST API with JWT
- **Session management**: STATELESS (no server-side sessions)
- **Authorization rules**:
  - `/api/properties/**` - Allow all (property CRUD operations)
  - `/actuator/**` - Allow all (health checks, metrics)
  - All other requests - Allow all

## How to Apply the Fix

### Option 1: Restart Property Service Only
```bash
cd backend
./restart-property-service.sh
```

### Option 2: Restart All Services
```bash
cd backend
./restart-services.sh
```

### Option 3: Manual Restart
```bash
# Stop property service
pkill -f "globalhub-property-service"

# Start property service
cd backend/globalhub-property-service
mvn spring-boot:run &
```

## Verification

### 1. Check Service is Running
```bash
curl http://localhost:8085/actuator/health
```
Expected: `{"status":"UP"}`

### 2. Test Property Creation
```bash
curl -X POST http://localhost:8085/api/properties \
  -H "Content-Type: multipart/form-data" \
  -F 'property={"title":"Test Property","vendorId":1,"propertyType":"HOUSE","listingType":"SALE","price":5000000,"address":"Test Address","county":"Nairobi"}' \
  -F 'images=@/path/to/image.jpg'
```

### 3. Test from Frontend
1. Login as vendor via `/VendorLogin`
2. Navigate to "Add Property"
3. Fill in property details
4. Upload at least one image
5. Click "Submit for Review"
6. Should see success message (no 403 error)

## Why This Happened
The property service was created with Spring Security dependency but the SecurityConfig was never added. This is a common oversight when:
1. Copying dependencies from another service
2. Using Spring Initializr with security selected
3. Planning to add security later but forgetting

## Other Services to Check
Make sure these services also have SecurityConfig if they have Spring Security:
- ✅ globalhub-gateway - Has SecurityConfig
- ✅ globalhub-auth-service - Has SecurityConfig  
- ✅ globalhub-property-service - **NOW FIXED**
- ❓ globalhub-vendor-service - Check if needed
- ❓ globalhub-product-service - Check if needed
- ❓ globalhub-hotel-service - Check if needed
- ❓ globalhub-tour-service - Check if needed

## Alternative Solution (If JWT Auth is Needed)
If you want to enforce JWT authentication for property endpoints:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/properties/active").permitAll()  // Public listings
                .requestMatchers("/api/properties/**").authenticated()  // Require auth
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());  // Enable JWT validation
        
        return http.build();
    }
}
```

But for now, we're allowing all requests since the gateway handles authentication.
