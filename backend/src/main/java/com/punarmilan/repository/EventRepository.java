package com.punarmilan.repository;

import com.punarmilan.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByStatus(String status);

    List<Event> findByStartTimeAfterAndStatusOrderByStartTimeAsc(LocalDateTime startTime, String status);
}
