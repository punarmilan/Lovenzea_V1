package com.punarmilan.controller;

import com.punarmilan.dto.DashboardSummaryDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthUtil authUtil;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        log.info("Fetching dashboard summary for current user");
        return ResponseEntity.ok(dashboardService.getDashboardSummary(authUtil.getCurrentUser()));
    }
}
