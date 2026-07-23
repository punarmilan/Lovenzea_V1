package com.punarmilan.service.impl;

import com.punarmilan.dto.ChatMessageDTO;
import com.punarmilan.entity.ChatMessage;
import com.punarmilan.entity.User;
import com.punarmilan.exception.PremiumRequiredException;
import com.punarmilan.exception.ResourceNotFoundException;
import com.punarmilan.repository.ChatMessageRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.ChatService;
import com.punarmilan.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final UserSubscriptionService userSubscriptionService;
    private final com.punarmilan.repository.ProfileRepository profileRepository;
    private final com.punarmilan.service.UserActivityService userActivityService;
    private final com.punarmilan.service.MinioService minioService;

    @Override
    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO dto) {
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // Validation: Only Premium users can send chat messages
        if (!userSubscriptionService.isPremiumUser(sender)) {
            log.warn("Non-premium user {} attempted to send a chat message", sender.getEmail());
            throw new PremiumRequiredException("Chat is available only for Premium users. Please upgrade your plan.");
        }

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .content(dto.getContent())
                .read(false)
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        log.info("Saved encrypted chat message from {} to {}", sender.getEmail(), recipient.getEmail());
        return toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageDTO> getConversationHistory(User user1, Long user2Id, int page, int size) {
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return chatMessageRepository.findConversationHistory(user1, user2, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional
    public void markAsRead(Long messageId, User recipient) {
        chatMessageRepository.findById(messageId).ifPresent(msg -> {
            if (msg.getRecipient().getId().equals(recipient.getId()) && !msg.isRead()) {
                msg.setRead(true);
                chatMessageRepository.save(msg);
            }
        });
    }

    @Override
    @Transactional
    public void markConversationAsRead(User partner, User recipient) {
        log.info("Marking conversation as read: partner={}, recipient={}", partner.getEmail(), recipient.getEmail());
        chatMessageRepository.markConversationAsRead(partner, recipient);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.punarmilan.dto.ConversationDTO> getRecentConversations(User user) {
        log.info("Fetching recent conversations for user: {}", user.getEmail());

        // Fetch last 100 messages involving this user
        List<ChatMessage> recentMessages = chatMessageRepository.findRecentMessagesForUser(user,
                PageRequest.of(0, 100));

        // Group by partner ID and keep latest
        java.util.Map<Long, ChatMessage> latestMessagesByPartner = new java.util.LinkedHashMap<>();

        for (ChatMessage m : recentMessages) {
            User partner = m.getSender().getId().equals(user.getId()) ? m.getRecipient() : m.getSender();
            if (!latestMessagesByPartner.containsKey(partner.getId())) {
                latestMessagesByPartner.put(partner.getId(), m);
            }
        }

        // Map to DTOs and enrich with profile data
        return latestMessagesByPartner.entrySet().stream().map(entry -> {
            Long partnerId = entry.getKey();
            ChatMessage lastMsg = entry.getValue();
            User partner = lastMsg.getSender().getId().equals(user.getId()) ? lastMsg.getRecipient()
                    : lastMsg.getSender();

            com.punarmilan.entity.Profile profile = profileRepository.findByUserId(partnerId).orElse(null);

            return com.punarmilan.dto.ConversationDTO.builder()
                    .otherUserId(partnerId)
                    .otherUserName(profile != null ? profile.getFullName() : partner.getEmail())
                    .otherProfilePhotoUrl(profile != null ? getPresignedPhotoUrl(profile.getProfilePhotoUrl()) : null)
                    .lastMessage(lastMsg.getContent())
                    .lastActive(lastMsg.getCreatedAt())
                    .unreadCount(chatMessageRepository.countBySenderAndRecipientAndReadFalse(partner, user))
                    .isOnline(userActivityService.isUserOnline(partner.getEmail()))
                    .build();
        }).collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return chatMessageRepository.countByRecipientAndReadFalse(user);
    }

    private ChatMessageDTO toDTO(ChatMessage m) {
        return ChatMessageDTO.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .recipientId(m.getRecipient().getId())
                .content(m.getContent())
                .read(m.isRead())
                .createdAt(m.getCreatedAt())
                .build();
    }

    /**
     * Converts a raw MinIO storage path to a presigned (viewable) URL.
     * Handles both raw object keys and legacy full URLs.
     */
    private String getPresignedPhotoUrl(String storedValue) {
        if (storedValue == null || storedValue.isEmpty()) {
            return null;
        }
        try {
            String actualPath = storedValue;
            if (storedValue.contains("/punarmilan-photos/")) {
                java.net.URI uri = new java.net.URI(storedValue);
                String path = uri.getPath();
                actualPath = path.substring(path.indexOf("/punarmilan-photos/") + "/punarmilan-photos/".length());
                if (actualPath.contains("?")) {
                    actualPath = actualPath.substring(0, actualPath.indexOf("?"));
                }
            }
            return minioService.getPresignedUrl(actualPath);
        } catch (Exception e) {
            log.warn("Failed to generate presigned URL for: {}", storedValue);
            return null;
        }
    }
}
