package com.punarmilan.repository;

import com.punarmilan.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByEventId(Long eventId);
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    java.util.List<EventRegistration> findByReminderSentFalseAndEventStartTimeBefore(java.time.LocalDateTime time);
}
