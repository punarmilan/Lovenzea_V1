package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;

    private Long reportedUserId;
    private String reportedUserName;
    private String reportedUserEmail;
    private String reportedUserProfileId;

    private String reason;
    private String description;
    private String status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
