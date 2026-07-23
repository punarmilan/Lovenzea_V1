package com.punarmilan.repository;

import com.punarmilan.entity.ChatMessage;
import com.punarmilan.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender = :user1 AND m.recipient = :user2) OR " +
            "(m.sender = :user2 AND m.recipient = :user1) " +
            "ORDER BY m.createdAt DESC")
    Page<ChatMessage> findConversationHistory(@Param("user1") User user1, @Param("user2") User user2,
            Pageable pageable);

    long countByRecipientAndReadFalse(User recipient);

    long countBySenderAndRecipientAndReadFalse(User sender, User recipient);

    @Query("SELECT m FROM ChatMessage m WHERE m.recipient = :recipient AND m.read = false")
    List<ChatMessage> findUnreadByRecipient(@Param("recipient") User recipient);

    @Query("SELECT m FROM ChatMessage m WHERE m.sender = :user OR m.recipient = :user " +
            "ORDER BY m.createdAt DESC")
    List<ChatMessage> findRecentMessagesForUser(@Param("user") User user, Pageable pageable);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE ChatMessage m SET m.read = true WHERE m.sender = :sender AND m.recipient = :recipient AND m.read = false")
    void markConversationAsRead(@Param("sender") User sender, @Param("recipient") User recipient);

    List<ChatMessage> findBySenderAndRecipientAndReadFalse(User sender, User recipient);
}
