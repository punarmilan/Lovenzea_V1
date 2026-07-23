package com.punarmilan.service;

import com.punarmilan.dto.ChatMessageDTO;
import com.punarmilan.entity.User;
import org.springframework.data.domain.Page;

public interface ChatService {
    ChatMessageDTO saveMessage(ChatMessageDTO messageDTO);

    Page<ChatMessageDTO> getConversationHistory(User user1, Long user2Id, int page, int size);

    java.util.List<com.punarmilan.dto.ConversationDTO> getRecentConversations(User user);

    void markAsRead(Long messageId, User recipient);

    void markConversationAsRead(User partner, User recipient);

    long getUnreadCount(User user);
}
