package com.punarmilan.controller;

import com.punarmilan.dto.LoginRequest;
import com.punarmilan.dto.RegisterRequest;
import com.punarmilan.dto.UserResponse;
import com.punarmilan.dto.VerifyOtpRequest;
import com.punarmilan.dto.ResetPasswordOtpRequest;

import com.punarmilan.dto.LoginOtpRequest;
import com.punarmilan.dto.LoginOtpVerifyRequest;
import com.punarmilan.dto.TokenRefreshRequest;
import com.punarmilan.dto.TokenRefreshResponse;
import com.punarmilan.dto.ForgotPasswordRequest;
import com.punarmilan.dto.ResetPasswordRequest;
import com.punarmilan.dto.MessageResponse;
import com.punarmilan.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.entity.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;

    @org.springframework.beans.factory.annotation.Value("${server.ssl.enabled:false}")
    private boolean sslEnabled;

    private boolean isSecureCookie() {
        // Only set Secure flag when SSL is actually enabled (production)
        // On localhost HTTP, Secure cookies are silently dropped by browsers
        return sslEnabled;
    }

    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(isSecureCookie());
        accessCookie.setPath("/");
        accessCookie.setMaxAge(24 * 60 * 60); // 24 hours (was: 15 mins)
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(isSecureCookie());
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(refreshCookie);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        log.info("Registration request received for email: {}", request.getEmail());

        UserResponse authResponse = authService.register(request);
        setTokenCookies(response, authResponse.getAccessToken(), authResponse.getRefreshToken());

        log.info("Registration successful for user ID: {}", authResponse.getId());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        log.info("Login request received for: {}", request.getEmail());

        UserResponse authResponse = authService.login(request);
        setTokenCookies(response, authResponse.getAccessToken(), authResponse.getRefreshToken());

        log.info("Login successful for user ID: {}", authResponse.getId());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @RequestBody(required = false) TokenRefreshRequest bodyRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        log.info("Token refresh request received");

        // 1. Try to get refresh token from request body first
        String refreshTokenValue = null;
        if (bodyRequest != null && bodyRequest.getRefreshToken() != null && !bodyRequest.getRefreshToken().isBlank()) {
            refreshTokenValue = bodyRequest.getRefreshToken();
        }

        // 2. If not in body, read from cookie (HTTP-only cookies can't be read by JS)
        if (refreshTokenValue == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshTokenValue = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            log.warn("No refresh token found in body or cookies");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("No refresh token provided"));
        }

        TokenRefreshRequest refreshRequest = new TokenRefreshRequest(refreshTokenValue);
        TokenRefreshResponse authResponse = authService.refreshToken(refreshRequest);

        // Set the new access token as a cookie
        Cookie accessCookie = new Cookie("accessToken", authResponse.getAccessToken());
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(isSecureCookie());
        accessCookie.setPath("/");
        accessCookie.setMaxAge(24 * 60 * 60); // 24 hours (was: 15 mins)
        response.addCookie(accessCookie);

        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authUtil.getCurrentUser();
        // Return user info WITHOUT tokens
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .createdAt(user.getCreatedAt())
                .isPremium(user.getIsPremium())
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.processForgotPassword(request);
        return ResponseEntity.ok(new MessageResponse("OTP has been sent to your email"));
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<MessageResponse> verifyForgotPasswordOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyForgotPasswordOtp(request);
        return ResponseEntity.ok(new MessageResponse("OTP verified successfully"));
    }

    @PostMapping("/reset-password-otp")
    public ResponseEntity<MessageResponse> resetPasswordWithOtp(@Valid @RequestBody ResetPasswordOtpRequest request) {
        authService.resetPasswordWithOtp(request);
        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(new MessageResponse("Email has been verified successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            authService.verifyOtp(request);
            return ResponseEntity.ok(new MessageResponse(request.getType() + " verified successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String identifier, @RequestParam String type) {
        try {
            authService.resendOtp(identifier, type);
            return ResponseEntity.ok(new MessageResponse("OTP resent successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login-otp/request")
    public ResponseEntity<?> requestLoginOtp(@Valid @RequestBody LoginOtpRequest request) {
        try {
            authService.requestLoginOtp(request);
            return ResponseEntity.ok(new MessageResponse("Login OTP sent successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login-otp/verify")
    public ResponseEntity<?> verifyLoginOtp(@Valid @RequestBody LoginOtpVerifyRequest request, HttpServletResponse response) {
        try {
            UserResponse userResponse = authService.verifyLoginOtp(request);
            
            // Set access token cookie
            ResponseCookie jwtCookie = ResponseCookie.from("accessToken", userResponse.getAccessToken())
                    .path("/")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    .maxAge(24 * 60 * 60) // 24 hours
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

            // Set refresh token cookie
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", userResponse.getRefreshToken())
                    .path("/")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletResponse response) {
        String email = authUtil.getCurrentUserEmail();
        log.info("Logout request received for email: {}", email);
        authService.logout(email);

        // Clear cookies â€” must match the same flags used when setting them
        Cookie accessCookie = new Cookie("accessToken", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}