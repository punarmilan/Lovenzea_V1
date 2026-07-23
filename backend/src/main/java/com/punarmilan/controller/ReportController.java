package com.punarmilan.controller;

import com.punarmilan.dto.ReportDTO;
import com.punarmilan.entity.User;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final AdminReportService adminReportService;
    private final AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<Void> submitReport(@RequestBody ReportDTO reportDTO) {
        log.info("Received report submission from user");
        User reporter = authUtil.getCurrentUser();
        adminReportService.createReport(reportDTO, reporter.getId());
        return ResponseEntity.ok().build();
    }
}
