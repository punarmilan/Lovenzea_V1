package com.punarmilan.service;

public interface MailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendVerificationEmail(String to, String verificationLink);
    void sendOtpEmail(String to, String otp);
    void sendVerificationSuccessEmail(String to);
    void sendReferralEmail(String to, String senderName);
}
