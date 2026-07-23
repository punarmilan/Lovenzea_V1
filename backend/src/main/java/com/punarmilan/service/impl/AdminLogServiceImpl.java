package com.punarmilan.service.impl;

import com.punarmilan.entity.AdminLog;
import com.punarmilan.repository.AdminLogRepository;
import com.punarmilan.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminLogServiceImpl implements AdminLogService {

    private final AdminLogRepository adminLogRepository;

    @Override
    public void logAction(String action, String details) {
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        AdminLog log = AdminLog.builder()
                .adminEmail(adminEmail)
                .action(action)
                .details(details)
                .build();
        adminLogRepository.save(log);
    }

    @Override
    public Page<AdminLog> getAllLogs(Pageable pageable) {
        return adminLogRepository.findAll(pageable);
    }
}
