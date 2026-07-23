package com.punarmilan.service.impl;

import com.punarmilan.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${punarmilan.mail.from-name:PunarMilan}")
    private String fromName;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async("taskExecutor")
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Reset Your Password - Punarmilan";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">"
                + "<h2>Password Reset Request</h2>"
                + "<p>You have requested to reset your password. Click the button below to set a new password:</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + resetLink
                + "\" style=\"background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Reset Password</a>"
                + "</div>"
                + "<p>If you did not request this, please ignore this email.</p>"
                + "<p>This link will expire in 1 hour.</p>"
                + "</div>";

        sendEmail(to, subject, htmlContent);
    }

    @Async("taskExecutor")
    @Override
    public void sendVerificationEmail(String to, String verificationLink) {
        String subject = "Verify Your Account - Punarmilan";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;\">"
                + "<h2 style=\"color: #e11d48; text-align: center;\">Welcome to Punarmilan!</h2>"
                + "<p>Thank you for joining our community. To get started and find your perfect match, please verify your email address by clicking the button below:</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + verificationLink
                + "\" style=\"background-color: #e11d48; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;\">Verify Email Address</a>"
                + "</div>"
                + "<p style=\"color: #666; font-size: 14px;\">This link will expire in 24 hours for security reasons.</p>"
                + "<p style=\"color: #666; font-size: 14px;\">If you didn't create an account, please ignore this email.</p>"
                + "<hr style=\"border: 0; border-top: 1px solid #eee; margin: 20px 0;\">"
                + "<p style=\"text-align: center; color: #999; font-size: 12px;\">&copy; 2026 Punarmilan. All rights reserved.</p>"
                + "</div>";

        sendEmail(to, subject, htmlContent);
    }

    @Async("taskExecutor")
    @Override
    public void sendOtpEmail(String to, String otp) {
        log.info("=========================================");
        log.info("LOCAL DEV EMAIL OTP INTERCEPTED");
        log.info("To: {}", to);
        log.info("OTP: {}", otp);
        log.info("=========================================");
        String subject = "Your OTP for Punarmilan Registration";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;\">"
                + "<h2 style=\"color: #e11d48; text-align: center;\">Welcome to Punarmilan!</h2>"
                + "<p>To complete your registration, please enter the following OTP:</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<span style=\"background-color: #f3f4f6; color: #333; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 24px; letter-spacing: 4px;\">"
                + otp + "</span>"
                + "</div>"
                + "<p style=\"color: #666; font-size: 14px;\">This OTP will expire in 10 minutes.</p>"
                + "<p style=\"color: #666; font-size: 14px;\">If you didn't create an account, please ignore this email.</p>"
                + "<hr style=\"border: 0; border-top: 1px solid #eee; margin: 20px 0;\">"
                + "<p style=\"text-align: center; color: #999; font-size: 12px;\">&copy; 2026 Punarmilan. All rights reserved.</p>"
                + "</div>";

        sendEmail(to, subject, htmlContent);
    }

    @Async("taskExecutor")
    @Override
    public void sendVerificationSuccessEmail(String to) {
        String subject = "Account Verified Successfully - Punarmilan";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; text-align: center;\">"
                + "<div style=\"color: #22c55e; font-size: 48px; margin-bottom: 20px;\">âœ“</div>"
                + "<h2 style=\"color: #e11d48;\">Email Verified!</h2>"
                + "<p>Congratulations! Your email address has been successfully verified.</p>"
                + "<p>Your account is now fully active, and you can start looking for matches.</p>"
                + "<div style=\"margin: 30px 0;\">"
                + "<a href=\"" + frontendUrl + "/login\" style=\"background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;\">Login to Your Account</a>"
                + "</div>"
                + "<p style=\"color: #666; font-size: 14px;\">We're excited to have you on board!</p>"
                + "</div>";

        sendEmail(to, subject, htmlContent);
    }

    @Async("taskExecutor")
    @Override
    public void sendReferralEmail(String to, String senderName) {
        String subject = senderName + " has invited you to join Punarmilan - Find Your Perfect Match";
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;\">"
                + "<div style=\"text-align: center; margin-bottom: 25px;\">"
                + "<h1 style=\"color: #e11d48; margin: 0;\">PunarMilan</h1>"
                + "<p style=\"color: #999; font-size: 14px; margin-top: 5px;\">Where Souls Meet</p>"
                + "</div>"
                + "<h2 style=\"color: #333;\">Hello!</h2>"
                + "<p style=\"font-size: 16px; line-height: 1.6; color: #555;\">"
                + "<strong>" + senderName + "</strong> thinks you might find your perfect match on Punarmilan.com. "
                + "Our community is dedicated to helping people find meaningful relationships and lifelong companionship."
                + "</p>"
                + "<div style=\"background-color: #fff1f2; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;\">"
                + "<h3 style=\"color: #e11d48; margin-top: 0;\">Special Invitation</h3>"
                + "<p style=\"color: #666; margin-bottom: 20px;\">Join today and start your journey towards finding someone special.</p>"
                + "<a href=\"https://punarmilan.com/register\" style=\"background-color: #e11d48; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;\">Join PunarMilan Now</a>"
                + "</div>"
                + "<div style=\"color: #666; font-size: 14px; line-height: 1.6;\">"
                + "<p><strong>Why join Punarmilan?</strong></p>"
                + "<ul>"
                + "<li>Verified profiles for safety and security</li>"
                + "<li>Advanced matching based on your preferences</li>"
                + "<li>Privacy controls for your photos and contact details</li>"
                + "<li>Dedicated support to help you find your match</li>"
                + "</ul>"
                + "</div>"
                + "<hr style=\"border: 0; border-top: 1px solid #eee; margin: 25px 0;\">"
                + "<p style=\"color: #999; font-size: 12px; text-align: center;\">"
                + "You received this mail because " + senderName + " invited you using our Refer a Friend program. "
                + "If you don't wish to join, you can simply ignore this email."
                + "</p>"
                + "<p style=\"text-align: center; color: #999; font-size: 12px;\">&copy; 2026 Punarmilan. All rights reserved.</p>"
                + "</div>";

        sendEmail(to, subject, htmlContent);
    }

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: (Mail Auth/Connection Error)", to);
            log.error("HINT: If you are testing locally, check the console above for the printed OTP!");
        }
    }
}
