package com.punarmilan.controller;

import com.punarmilan.dto.AdminLoginRequest;
import com.punarmilan.dto.AdminResponse;
import com.punarmilan.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@Slf4j
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<AdminResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        log.info("Admin login request received for email: {}", request.getEmail());
        AdminResponse response = adminAuthService.login(request);
        log.info("Admin login successful for email: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }
}
