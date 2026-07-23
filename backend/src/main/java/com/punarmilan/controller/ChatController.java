package com.punarmilan.controller;

import com.punarmilan.dto.ChatMessageDTO;
import com.punarmilan.entity.User;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    // â”€â”€ WebSocket Endpoint â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDTO messageDTO, java.security.Principal principal) {
        if (principal == null) {
            log.error("Received WebSocket message but principal is null! Session might be unauthorized.");
            return;
        }
        
        String senderEmail = principal.getName();
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Sender not found: " + senderEmail));

        log.info("Received real-time message via WebSocket from {} to recipient ID {}",
                senderEmail, messageDTO.getRecipientId());

        // Ensure sender ID is correct
        messageDTO.setSenderId(sender.getId());

        try {
            // Save to DB (Encrypted + Compressed)
            ChatMessageDTO savedDTO = chatService.saveMessage(messageDTO);

            // Fetch recipient to get email for routing
            userRepository.findById(savedDTO.getRecipientId()).ifPresent(recipient -> {
                // Push to recipient's private queue
                messagingTemplate.convertAndSendToUser(
                        recipient.getEmail(),
                        "/queue/messages",
                        savedDTO);
            });

            // Also push back to sender for synchronization across tabs/devices
            messagingTemplate.convertAndSendToUser(
                    senderEmail,
                    "/queue/messages",
                    savedDTO);
        } catch (com.punarmilan.exception.PremiumRequiredException e) {
            log.warn("Premium validation failed for user {}: {}", senderEmail, e.getMessage());
            // Create a special error DTO to send back to the user
            ChatMessageDTO errorDTO = ChatMessageDTO.builder()
                    .senderId(sender.getId())
                    .recipientId(messageDTO.getRecipientId())
                    .content(messageDTO.getContent())
                    .error(e.getMessage())
                    .createdAt(java.time.LocalDateTime.now())
                    .build();

            messagingTemplate.convertAndSendToUser(
                    senderEmail,
                    "/queue/messages",
                    errorDTO);
        }
    }

    // â”€â”€ REST Endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    @GetMapping("/history/{targetUserId}")
    public ResponseEntity<Page<ChatMessageDTO>> getHistory(
            @PathVariable Long targetUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User currentUser = authUtil.getCurrentUser();
        return ResponseEntity.ok(chatService.getConversationHistory(currentUser, targetUserId, page, size));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        User currentUser = authUtil.getCurrentUser();
        return ResponseEntity.ok(chatService.getUnreadCount(currentUser));
    }

    @GetMapping("/conversations")
    public ResponseEntity<java.util.List<com.punarmilan.dto.ConversationDTO>> getRecentConversations() {
        User currentUser = authUtil.getCurrentUser();
        return ResponseEntity.ok(chatService.getRecentConversations(currentUser));
    }

    @PatchMapping("/read/{messageId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        User currentUser = authUtil.getCurrentUser();
        chatService.markAsRead(messageId, currentUser);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read/all/{partnerId}")
    public ResponseEntity<Void> markConversationAsRead(@PathVariable Long partnerId) {
        User currentUser = authUtil.getCurrentUser();
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Partner not found"));
        chatService.markConversationAsRead(partner, currentUser);
        return ResponseEntity.ok().build();
    }
}
