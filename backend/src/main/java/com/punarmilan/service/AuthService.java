package com.punarmilan.service;

import com.punarmilan.dto.*;
import com.punarmilan.dto.UserResponse;
import com.punarmilan.dto.TokenRefreshRequest;
import com.punarmilan.dto.TokenRefreshResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    UserResponse login(LoginRequest request);

    TokenRefreshResponse refreshToken(TokenRefreshRequest request);

    void processForgotPassword(ForgotPasswordRequest request);

    void verifyForgotPasswordOtp(VerifyOtpRequest request);

    void resetPasswordWithOtp(ResetPasswordOtpRequest request);

    void resetPassword(ResetPasswordRequest request);

    void verifyEmail(String token);

    void verifyOtp(VerifyOtpRequest request);

    void resendOtp(String identifier, String type);
    
    void requestLoginOtp(LoginOtpRequest request);
    
    UserResponse verifyLoginOtp(LoginOtpVerifyRequest request);

    void logout(String email);
}
