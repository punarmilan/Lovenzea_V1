package com.punarmilan.controller;

import com.punarmilan.dto.ReportDTO;
import com.punarmilan.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUB_ADMIN')")
public class AdminReportController {

    private final AdminReportService adminReportService;

    @GetMapping
    public ResponseEntity<Page<ReportDTO>> getAllReports(Pageable pageable) {
        return ResponseEntity.ok(adminReportService.getAllReports(pageable));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Void> resolveReport(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        adminReportService.resolveReport(id, payload.get("adminNote"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<Void> dismissReport(@PathVariable Long id) {
        adminReportService.dismissReport(id);
        return ResponseEntity.ok().build();
    }
}
