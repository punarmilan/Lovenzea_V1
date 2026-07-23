package com.punarmilan.dto;

import com.punarmilan.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private String senderName;
    private String senderPhotoUrl;
    private Long referenceId;
    private boolean read;
    private Boolean premiumVisible;
    private LocalDateTime createdAt;
}
