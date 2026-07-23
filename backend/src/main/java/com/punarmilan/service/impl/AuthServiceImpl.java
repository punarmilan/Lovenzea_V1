package com.punarmilan.service.impl;

import com.punarmilan.dto.*;
import com.punarmilan.entity.RefreshToken;
import com.punarmilan.entity.User;
import com.punarmilan.exception.DuplicateResourceException;
import com.punarmilan.exception.UnauthorizedException;
import com.punarmilan.repository.RefreshTokenRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.security.JwtUtils;
import com.punarmilan.service.AuthService;
import com.punarmilan.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final com.punarmilan.service.ProfileService profileService;
    private final com.punarmilan.service.MailService mailService;
    private final com.punarmilan.service.SmsService smsService;
    private final UserActivityService userActivityService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new DuplicateResourceException("Mobile number already registered");
        }

        User user = new User();
        user.setMobileNumber(request.getMobileNumber());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setMobileVerified(false);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        profileService.createDefaultProfile(savedUser, request.getFirstName(), request.getLastName(),
                request.getProfileCreatedBy(), request.getGender());

        String accessToken = jwtUtils.generateAccessToken(savedUser.getEmail());
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return UserResponse.builder()
                .id(savedUser.getId())
                .mobileNumber(savedUser.getMobileNumber())
                .email(savedUser.getEmail())
                .emailVerified(savedUser.getEmailVerified())
                .mobileVerified(savedUser.getMobileVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .profilePhotoUrl(null)
                .name(request.getFirstName() + " " + request.getLastName())
                .createdAt(savedUser.getCreatedAt())
                .isPremium(savedUser.getIsPremium())
                .build();
    }

    @Override
    @Transactional
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .or(() -> userRepository.findByMobileNumber(request.getEmail()))
                .orElseThrow(() -> new BadCredentialsException("Invalid email/mobile or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email/mobile or password");
        }
        if (!user.getEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        user.setLastActive(java.time.LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user);

        String profilePhotoUrl = null;
        String fullName = null;
        try {
            com.punarmilan.dto.ProfileDTO profile = profileService.getMyProfile(user);
            profilePhotoUrl = profile.getProfilePhotoUrl();
            fullName = profile.getFullName();
        } catch (Exception e) {
            log.warn("Could not fetch profile info for user: {}", user.getId());
        }

        return UserResponse.builder()
                .id(user.getId())
                .mobileNumber(user.getMobileNumber())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .profilePhotoUrl(profilePhotoUrl)
                .name(fullName)
                .createdAt(user.getCreatedAt())
                .isPremium(user.getIsPremium())
                .build();
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtUtils.generateAccessToken(user.getEmail());
                    return TokenRefreshResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void processForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));
        
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setEmailOtp(otp);
        user.setEmailOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        
        mailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public void verifyForgotPasswordOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        if (user.getEmailOtp() == null || !user.getEmailOtp().equals(request.getOtp())) {
            throw new com.punarmilan.exception.UnauthorizedException("Invalid OTP");
        }

        if (user.getEmailOtpExpiry() == null || user.getEmailOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new com.punarmilan.exception.UnauthorizedException("OTP has expired");
        }
    }

    @Override
    @Transactional
    public void resetPasswordWithOtp(ResetPasswordOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        if (user.getEmailOtp() == null || !user.getEmailOtp().equals(request.getOtp())) {
            throw new com.punarmilan.exception.UnauthorizedException("Invalid OTP");
        }

        if (user.getEmailOtpExpiry() == null || user.getEmailOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new com.punarmilan.exception.UnauthorizedException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setEmailOtp(null);
        user.setEmailOtpExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new com.punarmilan.exception.UnauthorizedException("Invalid reset token"));
        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new com.punarmilan.exception.UnauthorizedException("Reset token has expired");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new com.punarmilan.exception.UnauthorizedException("Invalid verification token"));
        if (user.getVerificationTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new com.punarmilan.exception.UnauthorizedException("Verification token has expired");
        }
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
        mailService.sendVerificationSuccessEmail(user.getEmail());
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtUtils.getRefreshExpiration()));
        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token was expired");
        }
        return token;
    }

    @Override
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        if ("EMAIL".equalsIgnoreCase(request.getType())) {
            User user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email address"));
            if (user.getEmailOtp() == null || !user.getEmailOtp().equals(request.getOtp())) {
                throw new IllegalArgumentException("Invalid email OTP");
            }
            if (user.getEmailOtpExpiry() == null || user.getEmailOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("Email OTP has expired");
            }
            user.setEmailVerified(true);
            user.setEmailOtp(null);
            user.setEmailOtpExpiry(null);
            userRepository.save(user);
            mailService.sendVerificationSuccessEmail(user.getEmail());
        } else if ("MOBILE".equalsIgnoreCase(request.getType())) {
            User user = userRepository.findByMobileNumber(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid mobile number"));
            if (user.getMobileOtp() == null || !user.getMobileOtp().equals(request.getOtp())) {
                throw new IllegalArgumentException("Invalid mobile OTP");
            }
            if (user.getMobileOtpExpiry() == null || user.getMobileOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("Mobile OTP has expired");
            }
            user.setMobileVerified(true);
            user.setMobileOtp(null);
            user.setMobileOtpExpiry(null);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Invalid verification type");
        }
    }

    @Override
    @Transactional
    public void resendOtp(String identifier, String type) {
        if ("EMAIL".equalsIgnoreCase(type)) {
            User user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email address"));
            if (user.getEmailVerified()) {
                throw new IllegalArgumentException("Email is already verified");
            }
            String emailOtp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setEmailOtp(emailOtp);
            user.setEmailOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            mailService.sendOtpEmail(user.getEmail(), emailOtp);
        } else if ("MOBILE".equalsIgnoreCase(type)) {
            User user = userRepository.findByMobileNumber(identifier)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid mobile number"));
            if (user.getMobileVerified()) {
                throw new IllegalArgumentException("Mobile number is already verified");
            }
            String mobileOtp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setMobileOtp(mobileOtp);
            user.setMobileOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            smsService.sendOtpSms(user.getMobileNumber(), mobileOtp);
        } else {
            throw new IllegalArgumentException("Invalid verification type");
        }
    }
    
    @Override
    @Transactional
    public void requestLoginOtp(LoginOtpRequest request) {
        if ("EMAIL".equalsIgnoreCase(request.getType())) {
            User user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("User with this email not found"));
            if (!user.getEnabled()) {
                throw new IllegalArgumentException("Account is disabled");
            }
            String emailOtp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setEmailOtp(emailOtp);
            user.setEmailOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            mailService.sendOtpEmail(user.getEmail(), emailOtp);
        } else if ("MOBILE".equalsIgnoreCase(request.getType())) {
            User user = userRepository.findByMobileNumber(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("User with this mobile number not found"));
            if (!user.getEnabled()) {
                throw new IllegalArgumentException("Account is disabled");
            }
            String mobileOtp = String.format("%06d", new java.util.Random().nextInt(999999));
            user.setMobileOtp(mobileOtp);
            user.setMobileOtpExpiry(java.time.LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            smsService.sendOtpSms(user.getMobileNumber(), mobileOtp);
        } else {
            throw new IllegalArgumentException("Invalid login type");
        }
    }

    @Override
    @Transactional
    public UserResponse verifyLoginOtp(LoginOtpVerifyRequest request) {
        User user;
        if ("EMAIL".equalsIgnoreCase(request.getType())) {
            user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (user.getEmailOtp() == null || !user.getEmailOtp().equals(request.getOtp())) {
                throw new IllegalArgumentException("Invalid email OTP");
            }
            if (user.getEmailOtpExpiry() == null || user.getEmailOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("Email OTP has expired");
            }
            user.setEmailOtp(null);
            user.setEmailOtpExpiry(null);
        } else if ("MOBILE".equalsIgnoreCase(request.getType())) {
            user = userRepository.findByMobileNumber(request.getIdentifier())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (user.getMobileOtp() == null || !user.getMobileOtp().equals(request.getOtp())) {
                throw new IllegalArgumentException("Invalid mobile OTP");
            }
            if (user.getMobileOtpExpiry() == null || user.getMobileOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("Mobile OTP has expired");
            }
            user.setMobileOtp(null);
            user.setMobileOtpExpiry(null);
        } else {
            throw new IllegalArgumentException("Invalid login type");
        }

        if (!user.getEnabled()) {
            throw new BadCredentialsException("Account is disabled");
        }

        user.setLastActive(java.time.LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        RefreshToken refreshToken = createRefreshToken(user);

        String profilePhotoUrl = null;
        try {
            profilePhotoUrl = profileService.getMyProfile(user).getProfilePhotoUrl();
        } catch (Exception e) {
            log.warn("Could not fetch profile photo for user: {}", user.getId());
        }

        return UserResponse.builder()
                .id(user.getId())
                .mobileNumber(user.getMobileNumber())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .profilePhotoUrl(profilePhotoUrl)
                .createdAt(user.getCreatedAt())
                .isPremium(user.getIsPremium())
                .build();
    }
}
