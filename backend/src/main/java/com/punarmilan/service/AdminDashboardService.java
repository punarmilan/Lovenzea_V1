package com.punarmilan.service;

import com.punarmilan.dto.AdminDashboardStatsDTO;

public interface AdminDashboardService {
    AdminDashboardStatsDTO getStats();
    java.util.List<com.punarmilan.entity.Admin> getAllStaff();
    com.punarmilan.entity.Admin createStaff(com.punarmilan.entity.Admin staff);
    void deleteStaff(Long id);
}
