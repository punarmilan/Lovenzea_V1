package com.punarmilan.service;

import com.punarmilan.dto.DashboardSummaryDTO;
import com.punarmilan.entity.User;

public interface DashboardService {
    DashboardSummaryDTO getDashboardSummary(User user);
}
