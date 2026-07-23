package com.punarmilan.service;

import com.punarmilan.dto.NotificationDTO;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.NotificationType;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NotificationService {

    Page<NotificationDTO> getNotifications(User user, int page, int size);

    List<NotificationDTO> getUnreadNotifications(User user);

    long getUnreadCount(User user);

    void markAsRead(Long notificationId, User user);

    void markAllAsRead(User user);

    /**
     * Internal method â€” used by other services to create notifications.
     */
    void createNotification(User recipient, NotificationType type, String title, String message,
            String senderName, String senderPhotoUrl, Long referenceId);
}
