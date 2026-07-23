package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDTO {
    private long totalUsers;
    private long pendingApprovals;
    private long pendingPhotoApprovals;
    private long activeSubscriptions;
    private long reportedProfiles;
    private double totalRevenue;
    private Map<String, Long> genderDistribution;
    private List<Map<String, Object>> userGrowth;
}
