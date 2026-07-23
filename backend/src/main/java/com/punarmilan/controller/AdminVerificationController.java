package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.service.AdminVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/verifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUB_ADMIN', 'KYC_VERIFIER')")
public class AdminVerificationController {

    private final AdminVerificationService adminVerificationService;

    @GetMapping("/profiles/pending")
    public ResponseEntity<Page<ProfileDTO>> getPendingProfiles(Pageable pageable) {
        return ResponseEntity.ok(adminVerificationService.getPendingProfiles(pageable));
    }

    @PostMapping("/profiles/{id}/approve")
    public ResponseEntity<Void> approveProfile(@PathVariable Long id) {
        adminVerificationService.approveProfile(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/profiles/{id}/reject")
    public ResponseEntity<Void> rejectProfile(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Incomplete or inaccurate information");
        adminVerificationService.rejectProfile(id, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/photos/pending")
    public ResponseEntity<Page<ProfileDTO>> getPendingPhotos(Pageable pageable) {
        return ResponseEntity.ok(adminVerificationService.getPendingPhotos(pageable));
    }

    @PostMapping("/photos/{id}/approve")
    public ResponseEntity<Void> approvePhotos(@PathVariable Long id) {
        adminVerificationService.approvePhotos(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/photos/{id}/reject")
    public ResponseEntity<Void> rejectPhotos(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Photos do not meet guidelines");
        adminVerificationService.rejectPhotos(id, reason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/photos/{id}/{index}")
    public ResponseEntity<Void> deleteUserPhoto(@PathVariable Long id, @PathVariable Integer index) {
        adminVerificationService.deleteUserPhoto(id, index);
        return ResponseEntity.ok().build();
    }
}
