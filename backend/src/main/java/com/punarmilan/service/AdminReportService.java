package com.punarmilan.service;

import com.punarmilan.dto.ReportDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminReportService {
    Page<ReportDTO> getAllReports(Pageable pageable);

    void resolveReport(Long reportId, String adminNote);

    void dismissReport(Long reportId);

    void createReport(ReportDTO reportDTO, Long reporterId);
}
