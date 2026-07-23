package com.punarmilan.controller;

import com.punarmilan.dto.NotificationDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthUtil authUtil;

    /** GET /api/notifications?page=0&size=20 â€” paginated list */
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching notifications for current user (page={}, size={})", page, size);
        return ResponseEntity.ok(notificationService.getNotifications(authUtil.getCurrentUser(), page, size));
    }

    /** GET /api/notifications/unread â€” unread notifications list */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        log.info("Fetching unread notifications for current user");
        return ResponseEntity.ok(notificationService.getUnreadNotifications(authUtil.getCurrentUser()));
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = notificationService.getUnreadCount(authUtil.getCurrentUser());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /** PATCH /api/notifications/{id}/read â€” mark single notification as read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        log.info("Marking notification {} as read", id);
        notificationService.markAsRead(id, authUtil.getCurrentUser());
        return ResponseEntity.ok().build();
    }

    /** PATCH /api/notifications/mark-all-read â€” mark all as read */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        log.info("Marking all notifications as read");
        notificationService.markAllAsRead(authUtil.getCurrentUser());
        return ResponseEntity.ok().build();
    }
}
