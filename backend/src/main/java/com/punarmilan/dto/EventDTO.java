package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String eventType;
    private String meetingLink;
    private boolean isNew;
    private Integer registeredCount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
