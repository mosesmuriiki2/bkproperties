package com.globalhub.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;
    
    @Value("${app.email.from:noreply@globalhub.com}")
    private String fromEmail;
    
    private final Random random = new Random();
    
    public void sendVendorRegistrationEmail(String toEmail, String firstName, String businessName) {
        String subject = "Welcome to GlobalHub - Vendor Registration Successful";
        String body = buildVendorRegistrationEmail(firstName, businessName);
        
        sendEmail(toEmail, subject, body);
        log.info("Vendor registration email sent to: {}", toEmail);
    }
    
    public void sendVendorApprovalEmail(String toEmail, String firstName, String businessName) {
        String subject = "GlobalHub - Vendor Account Approved!";
        String body = buildVendorApprovalEmail(firstName, businessName);
        
        sendEmail(toEmail, subject, body);
        log.info("Vendor approval email sent to: {}", toEmail);
    }
    
    public void sendPropertyListingEmail(String toEmail, String firstName, String propertyTitle, String listingId) {
        String subject = "Property Listed Successfully - " + propertyTitle;
        String body = buildPropertyListingEmail(firstName, propertyTitle, listingId);
        
        sendEmail(toEmail, subject, body);
        log.info("Property listing email sent to: {}", toEmail);
    }
    
    public void sendPropertyApprovalEmail(String toEmail, String firstName, String propertyTitle) {
        String subject = "Property Approved - " + propertyTitle;
        String body = buildPropertyApprovalEmail(firstName, propertyTitle);
        
        sendEmail(toEmail, subject, body);
        log.info("Property approval email sent to: {}", toEmail);
    }
    
    public String generateOTP() {
        String otp = String.format("%06d", random.nextInt(1000000));
        log.info("Generated OTP: {} at {}", otp, LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return otp;
    }
    
    public void sendOTPEmail(String toEmail, String firstName, String otp) {
        String subject = "GlobalHub - Email Verification Code";
        String body = buildOTPEmail(firstName, otp);
        
        sendEmail(toEmail, subject, body);
        log.info("OTP email sent to: {} with OTP: {}", toEmail, otp);
    }
    
    private void sendEmail(String toEmail, String subject, String body) {
        if (!emailEnabled) {
            log.info("EMAIL DISABLED - Would send email:");
            log.info("To: {}", toEmail);
            log.info("Subject: {}", subject);
            log.info("Body: {}", body);
            log.info("--- END EMAIL ---");
            return;
        }
        
        // TODO: Implement actual email sending when credentials are available
        // For now, just log the email content
        log.info("SENDING EMAIL:");
        log.info("From: {}", fromEmail);
        log.info("To: {}", toEmail);
        log.info("Subject: {}", subject);
        log.info("Body: {}", body);
        log.info("--- EMAIL SENT ---");
    }
    
    private String buildVendorRegistrationEmail(String firstName, String businessName) {
        return String.format("""
            Dear %s,
            
            Welcome to GlobalHub Property Marketplace!
            
            Your vendor registration for "%s" has been received and is currently under review.
            
            What happens next:
            • Our team will review your application within 24-48 hours
            • You will receive an email notification once approved
            • After approval, you can start listing your properties
            
            Login Details:
            • Visit: https://globalhub.com/login
            • Use your registered email and password
            
            Need help? Contact our support team at support@globalhub.com
            
            Best regards,
            GlobalHub Team
            
            ---
            This is an automated message. Please do not reply to this email.
            """, firstName, businessName);
    }
    
    private String buildVendorApprovalEmail(String firstName, String businessName) {
        return String.format("""
            Dear %s,
            
            Congratulations! Your vendor account for "%s" has been approved.
            
            You can now:
            • List properties for sale or rent
            • Upload property images and details
            • Manage your listings through the vendor dashboard
            • Track inquiries and bookings
            
            Get Started:
            1. Login to your vendor dashboard: https://globalhub.com/vendor-dashboard
            2. Complete your business profile
            3. Start listing your properties
            
            Tips for Success:
            • Add high-quality photos to your listings
            • Provide detailed property descriptions
            • Keep your contact information updated
            • Respond promptly to customer inquiries
            
            Welcome to the GlobalHub community!
            
            Best regards,
            GlobalHub Team
            """, firstName, businessName);
    }
    
    private String buildPropertyListingEmail(String firstName, String propertyTitle, String listingId) {
        return String.format("""
            Dear %s,
            
            Your property "%s" has been successfully listed on GlobalHub!
            
            Listing Details:
            • Property: %s
            • Listing ID: %s
            • Status: Under Review
            • Expected Review Time: 24-48 hours
            
            What's Next:
            • Our team will review your listing for quality and compliance
            • You'll receive an email once the listing is approved
            • Approved listings will be visible to potential buyers/renters
            
            Manage Your Listing:
            • View status: https://globalhub.com/vendor-dashboard
            • Edit details: Available after approval
            • Track views and inquiries in your dashboard
            
            Best regards,
            GlobalHub Team
            """, firstName, propertyTitle, propertyTitle, listingId);
    }
    
    private String buildPropertyApprovalEmail(String firstName, String propertyTitle) {
        return String.format("""
            Dear %s,
            
            Great news! Your property "%s" has been approved and is now live on GlobalHub.
            
            Your listing is now:
            ✅ Visible to potential buyers/renters
            ✅ Searchable in our property directory
            ✅ Featured in relevant search results
            
            Track Performance:
            • View listing statistics in your vendor dashboard
            • Monitor views, inquiries, and contact requests
            • Update pricing and availability as needed
            
            Maximize Your Success:
            • Respond quickly to inquiries
            • Keep your listing information current
            • Consider professional photography for better results
            
            View Your Live Listing: https://globalhub.com/properties
            
            Best regards,
            GlobalHub Team
            """, firstName, propertyTitle);
    }
    
    private String buildOTPEmail(String firstName, String otp) {
        return String.format("""
            Dear %s,
            
            Your GlobalHub verification code is: %s
            
            This code will expire in 10 minutes for security reasons.
            
            If you didn't request this code, please ignore this email or contact our support team.
            
            Best regards,
            GlobalHub Team
            
            ---
            For security, never share this code with anyone.
            """, firstName, otp);
    }
}