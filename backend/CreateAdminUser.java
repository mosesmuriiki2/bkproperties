import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility to generate BCrypt password hash for admin user
 * 
 * Compile and run:
 * javac -cp "globalhub-auth-service/target/classes:~/.m2/repository/org/springframework/security/spring-security-crypto/6.1.5/spring-security-crypto-6.1.5.jar" CreateAdminUser.java
 * java -cp ".:globalhub-auth-service/target/classes:~/.m2/repository/org/springframework/security/spring-security-crypto/6.1.5/spring-security-crypto-6.1.5.jar" CreateAdminUser
 */
public class CreateAdminUser {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("\nSQL to create admin user:");
        System.out.println("INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at, updated_at)");
        System.out.println("VALUES ('admin@globalhub.com', '" + hash + "', 'Super', 'Admin', '+254700000000', 'ADMIN', TRUE, TRUE, NOW(), NOW());");
    }
}
