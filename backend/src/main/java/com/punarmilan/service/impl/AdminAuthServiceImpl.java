package com.punarmilan.service.impl;

import com.punarmilan.dto.AdminLoginRequest;
import com.punarmilan.dto.AdminResponse;
import com.punarmilan.entity.Admin;
import com.punarmilan.repository.AdminRepository;
import com.punarmilan.security.JwtUtils;
import com.punarmilan.service.AdminAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
public class AdminAuthServiceImpl implements AdminAuthService {

    private final AdminRepository adminRepository;
    private final JwtUtils jwtUtils;
    private final DaoAuthenticationProvider authenticationProvider;

    public AdminAuthServiceImpl(
            AdminRepository adminRepository,
            JwtUtils jwtUtils,
            @org.springframework.beans.factory.annotation.Qualifier("adminAuthenticationProvider") DaoAuthenticationProvider authenticationProvider) {
        this.adminRepository = adminRepository;
        this.jwtUtils = jwtUtils;
        this.authenticationProvider = authenticationProvider;
    }

    @Override
    @Transactional
    public AdminResponse login(AdminLoginRequest request) {
        log.info("Admin login process started for: {}", request.getEmail());
        try {
            // Authenticate the admin using the specific admin provider
            authenticationProvider.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            log.info("Authentication successful for: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Authentication failed for: {} - Error: {}", request.getEmail(), e.getMessage());
            throw e;
        }

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Admin user not found in database after authentication: {}", request.getEmail());
                    return new com.punarmilan.exception.ResourceNotFoundException("Admin not found after authentication");
                });

        if (!admin.getStatus()) {
            log.warn("Admin account is disabled: {}", request.getEmail());
            throw new com.punarmilan.exception.UnauthorizedException("Admin account is inactive");
        }

        // Update last login
        admin.setLastLogin(LocalDateTime.now());
        adminRepository.save(admin);
        log.info("Admin last login updated for: {}", request.getEmail());

        // Generate token
        String token = jwtUtils.generateToken(admin.getEmail());
        log.info("JWT token generated for admin: {}", request.getEmail());

        return AdminResponse.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .role(admin.getRole())
                .token(token)
                .build();
    }
}
