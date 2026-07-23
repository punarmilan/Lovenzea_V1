package com.punarmilan.service.impl;

import com.punarmilan.dto.NotificationDTO;
import com.punarmilan.entity.Notification;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.NotificationType;
import com.punarmilan.repository.NotificationRepository;
import com.punarmilan.service.MinioService;
import com.punarmilan.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final com.punarmilan.service.EmailService emailService;
    private final com.punarmilan.repository.ProfileRepository profileRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final MinioService minioService;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotifications(User user, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotifications(User user) {
        return notificationRepository.findByRecipientAndReadFalseOrderByCreatedAtDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipient().getId().equals(user.getId()) && !n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
                log.debug("Marked notification {} as read for user {}", notificationId, user.getId());
            }
        });
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllReadByRecipientId(user.getId());
        log.info("Marked all notifications as read for user {}", user.getId());
    }

    @Override
    @org.springframework.scheduling.annotation.Async("taskExecutor")
    public void createNotification(User recipient, NotificationType type, String title, String message,
            String senderName, String senderPhotoUrl, Long referenceId) {
        log.info("Attempting to create {} notification for recipient ID: {} from {}", type, recipient.getId(),
                senderName);
        try {
            Notification notification = Notification.builder()
                    .recipient(recipient)
                    .type(type)
                    .title(title)
                    .message(message)
                    .senderName(senderName)
                    .senderPhotoUrl(senderPhotoUrl)
                    .referenceId(referenceId)
                    .read(false)
                    .build();
            notificationRepository.save(notification);
            log.info("Successfully saved notification ID: {} for user ID: {}", notification.getId(), recipient.getId());

            // Check preferences and send email
            checkAndSendEmail(recipient, type, title, message, senderName);

        } catch (Exception e) {
            log.error("CRITICAL ERROR saving notification: {}. Type: {}, Message: {}", e.getMessage(), type, message);
            // We don't rethrow to avoid breaking the calling transaction
        }
    }

    private void checkAndSendEmail(User recipient, NotificationType type, String title, String message,
            String senderName) {
        try {
            com.punarmilan.entity.Profile profile = profileRepository.findByUser(recipient).orElse(null);
            if (profile == null)
                return;

            boolean shouldSendEmail = true; // Default for critical system notifications
            String settingsJson = profile.getNotificationSettings();

            if (settingsJson != null && !settingsJson.isEmpty()) {
                com.fasterxml.jackson.databind.JsonNode settings = objectMapper.readTree(settingsJson);
                shouldSendEmail = isEmailEnabledForType(settings, type);
            }

            if (shouldSendEmail) {
                java.util.Map<String, Object> variables = new java.util.HashMap<>();
                variables.put("title", title);
                variables.put("message", message);
                variables.put("senderName", senderName);
                variables.put("recipientName", profile.getFullName());

                String subject = "PunarMilan: " + title;
                String template = getEmailTemplateForType(type);

                emailService.sendHtmlEmail(recipient.getEmail(), subject, template, variables);
            }
        } catch (Exception e) {
            log.error("Error checked/sending email notification: {}", e.getMessage());
        }
    }

    private boolean isEmailEnabledForType(com.fasterxml.jackson.databind.JsonNode settings, NotificationType type) {
        switch (type) {
            case PROFILE_VIEW:
                return getSettingEnabled(settings, "recentVisitors");
            case CONNECTION_REQUEST:
            case CONNECTION_ACCEPTED:
            case CONNECTION_DECLINED:
            case PHOTO_REQUEST:
                return getSettingEnabled(settings, "contactAlert");
            case NEW_MATCH:
                return getSettingEnabled(settings, "matchMail");
            default:
                return true; // Default true for system/important notifications
        }
    }

    private boolean getSettingEnabled(com.fasterxml.jackson.databind.JsonNode settings, String sectionId) {
        com.fasterxml.jackson.databind.JsonNode section = settings.get(sectionId);
        if (section == null)
            return true;

        // Handle different setting structures (toggle vs frequency)
        if (section.has("enabled")) {
            return section.get("enabled").asBoolean();
        }
        if (section.has("emailFrequency")) {
            return !"unsubscribe".equalsIgnoreCase(section.get("emailFrequency").asText());
        }
        if (section.has("frequency")) {
            return !"unsubscribe".equalsIgnoreCase(section.get("frequency").asText());
        }
        return true;
    }

    private String getEmailTemplateForType(NotificationType type) {
        switch (type) {
            case CONNECTION_REQUEST:
                return "connection-request.html";
            case NEW_MATCH:
                return "new-match.html";
            default:
                return "generic-notification.html";
        }
    }

    // â”€â”€ Mapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    private NotificationDTO toDTO(Notification n) {
        String photoPath = n.getSenderPhotoUrl();
        Boolean premiumVisible = true;
        com.punarmilan.entity.Profile senderProfile = null;

        // Dynamically fetch the current profile photo and calculate visibility if
        // referenceId (Profile ID) is available
        if (n.getReferenceId() != null) {
            try {
                senderProfile = profileRepository.findById(n.getReferenceId()).orElse(null);
                if (senderProfile != null) {
                    if (senderProfile.getProfilePhotoUrl() != null && !senderProfile.getProfilePhotoUrl().isEmpty()) {
                        photoPath = senderProfile.getProfilePhotoUrl();
                    }

                    // Calculate visibility:
                    // False if (Sender is Premium) AND (Recipient is NOT Premium)
                    User recipient = n.getRecipient();
                    User senderUser = senderProfile.getUser();

                    boolean recipientIsPremium = isUserPremium(recipient);
                    boolean senderIsPremium = isUserPremium(senderUser);

                    if (senderIsPremium && !recipientIsPremium) {
                        premiumVisible = false;
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to dynamically process notification details for referenceId {}: {}",
                        n.getReferenceId(), e.getMessage());
            }
        }

        return NotificationDTO.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .senderName(n.getSenderName())
                .senderPhotoUrl(processPhotoUrl(photoPath))
                .referenceId(n.getReferenceId())
                .read(n.isRead())
                .premiumVisible(premiumVisible)
                .createdAt(n.getCreatedAt())
                .build();
    }

    private boolean isUserPremium(User user) {
        if (user == null)
            return false;
        return Boolean.TRUE.equals(user.getIsPremium()) &&
                user.getPremiumExpiry() != null &&
                user.getPremiumExpiry().isAfter(java.time.LocalDateTime.now());
    }

    private String processPhotoUrl(String path) {
        if (path == null || path.isEmpty() || "null".equals(path)) {
            return null;
        }
        try {
            String presignedUrl = minioService.getPresignedUrl(path);
            log.info("Processed photo URL - Input path: {}, Generated URL: {}", path, presignedUrl);
            return presignedUrl;
        } catch (Exception e) {
            log.warn("Failed to generate presigned URL for path: {}", path);
            return null;
        }
    }
}
