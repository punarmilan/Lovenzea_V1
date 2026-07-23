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
public class SupportTicketDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String subject;
    private String message;
    private String status;
    private String priority;
    private String adminResponse;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
