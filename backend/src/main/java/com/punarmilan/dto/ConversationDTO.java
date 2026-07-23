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
public class ConversationDTO {
    private Long otherUserId;
    private String otherUserName;
    private String otherProfilePhotoUrl;
    private String lastMessage;
    private LocalDateTime lastActive;
    private Long unreadCount;
    private Boolean isOnline;
}
