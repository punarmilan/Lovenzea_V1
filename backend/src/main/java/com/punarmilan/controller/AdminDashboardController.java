package com.punarmilan.controller;

import com.punarmilan.dto.AdminDashboardStatsDTO;
import com.punarmilan.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.punarmilan.entity.Admin;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUB_ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminDashboardService.getStats());
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SUB_ADMIN')")
    public ResponseEntity<List<Admin>> getAllStaff() {
        return ResponseEntity.ok(adminDashboardService.getAllStaff());
    }

    @PostMapping("/staff")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SUB_ADMIN')")
    public ResponseEntity<Admin> createStaff(@RequestBody Admin staff) {
        return ResponseEntity.ok(adminDashboardService.createStaff(staff));
    }

    @DeleteMapping("/staff/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        adminDashboardService.deleteStaff(id);
        return ResponseEntity.ok().build();
    }
}
