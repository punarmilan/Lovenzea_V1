package com.punarmilan.service;

import com.punarmilan.entity.AdminLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminLogService {
    void logAction(String action, String details);

    Page<AdminLog> getAllLogs(Pageable pageable);
}
