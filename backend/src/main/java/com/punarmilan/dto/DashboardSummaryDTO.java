package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {
    private ProfileDTO user;
    private Long pendingInvitations;
    private Long acceptedInvitations;
    private Long recentVisitorsCount;
    private Long interestsSentCount;
    private Integer profileCompletionPercentage;
}
