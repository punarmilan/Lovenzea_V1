package com.punarmilan.service.impl;

import com.punarmilan.dto.ReportDTO;
import com.punarmilan.entity.Report;
import com.punarmilan.repository.ReportRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.entity.User;
import com.punarmilan.service.AdminLogService;
import com.punarmilan.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

        private final ReportRepository reportRepository;
        private final UserRepository userRepository;
        private final AdminLogService adminLogService;

        @Override
        public Page<ReportDTO> getAllReports(Pageable pageable) {
                return reportRepository.findAll(pageable).map(this::convertToDTO);
        }

        private ReportDTO convertToDTO(Report report) {
                return ReportDTO.builder()
                                .id(report.getId())
                                .reporterId(report.getReporter().getId())
                                .reporterName(
                                                report.getReporter().getProfile() != null
                                                                ? report.getReporter().getProfile().getFullName()
                                                                : "User")
                                .reporterEmail(report.getReporter().getEmail())
                                .reportedUserId(report.getReportedUser().getId())
                                .reportedUserName(report.getReportedUser().getProfile() != null
                                                ? report.getReportedUser().getProfile().getFullName()
                                                : "User")
                                .reportedUserEmail(report.getReportedUser().getEmail())
                                .reportedUserProfileId(report.getReportedUser().getProfile() != null
                                                ? report.getReportedUser().getProfile().getProfileId()
                                                : "N/A")
                                .reason(report.getReason())
                                .description(report.getDescription())
                                .status(report.getStatus())
                                .adminNote(report.getAdminNote())
                                .createdAt(report.getCreatedAt())
                                .resolvedAt(report.getResolvedAt())
                                .build();
        }

        @Override
        @Transactional
        public void resolveReport(Long reportId, String adminNote) {
                Report report = reportRepository.findById(reportId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Report not found"));
                report.setStatus("RESOLVED");
                report.setAdminNote(adminNote);
                report.setResolvedAt(LocalDateTime.now());
                reportRepository.save(report);
                adminLogService.logAction("RESOLVE_REPORT", "Resolved report ID: " + reportId + ". Note: " + adminNote);
        }

        @Override
        @Transactional
        public void dismissReport(Long reportId) {
                Report report = reportRepository.findById(reportId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Report not found"));
                report.setStatus("DISMISSED");
                report.setResolvedAt(LocalDateTime.now());
                reportRepository.save(report);
                adminLogService.logAction("DISMISS_REPORT", "Dismissed report ID: " + reportId);
        }

        @Override
        @Transactional
        public void createReport(ReportDTO reportDTO, Long reporterId) {
                User reporter = userRepository.findById(reporterId)
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Reporter not found"));
                User reportedUser = userRepository.findById(reportDTO.getReportedUserId())
                                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Reported user not found"));

                Report report = Report.builder()
                                .reporter(reporter)
                                .reportedUser(reportedUser)
                                .reason(reportDTO.getReason())
                                .description(reportDTO.getDescription())
                                .status("PENDING")
                                .build();

                reportRepository.save(report);
        }
}
