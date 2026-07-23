package com.punarmilan.service.impl;

import com.punarmilan.dto.EventDTO;
import com.punarmilan.entity.Event;
import com.punarmilan.repository.EventRepository;
import com.punarmilan.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional
    @CacheEvict(value = "upcoming_events", allEntries = true)
    public EventDTO createEvent(EventDTO eventDTO) {
        log.info("Creating new event: {}", eventDTO.getTitle());
        Event event = mapToEntity(eventDTO);
        event.setCreatedAt(LocalDateTime.now());
        Event savedEvent = eventRepository.save(event);
        return mapToDTO(savedEvent);
    }

    @Override
    @Transactional
    @CacheEvict(value = "upcoming_events", allEntries = true)
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        log.info("Updating event with ID: {}", id);
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Event not found with id: " + id));

        existingEvent.setTitle(eventDTO.getTitle());
        existingEvent.setDescription(eventDTO.getDescription());
        existingEvent.setStartTime(eventDTO.getStartTime());
        existingEvent.setEndTime(eventDTO.getEndTime());
        existingEvent.setLocation(eventDTO.getLocation());
        existingEvent.setEventType(eventDTO.getEventType());
        existingEvent.setMeetingLink(eventDTO.getMeetingLink());
        existingEvent.setStatus(eventDTO.getStatus());

        // Only update these if provided explicitly, otherwise keep existing
        if (eventDTO.getRegisteredCount() != null) {
            existingEvent.setRegisteredCount(eventDTO.getRegisteredCount());
        }

        // Assume it's no longer "new" if it's being updated after creation, unless
        // explicitly set
        existingEvent.setNew(eventDTO.isNew());
        existingEvent.setUpdatedAt(LocalDateTime.now());

        Event updatedEvent = eventRepository.save(existingEvent);
        return mapToDTO(updatedEvent);
    }

    @Override
    @Transactional
    @CacheEvict(value = "upcoming_events", allEntries = true)
    public void deleteEvent(Long id) {
        log.info("Deleting event with ID: {}", id);
        if (!eventRepository.existsById(id)) {
            throw new com.punarmilan.exception.ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Override
    public EventDTO getEventById(Long id) {
        log.info("Fetching event with ID: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Event not found with id: " + id));
        return mapToDTO(event);
    }

    @Override
    public List<EventDTO> getAllEvents() {
        log.info("Fetching all events");
        return eventRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "upcoming_events")
    public List<EventDTO> getUpcomingEvents() {
        log.info("Fetching upcoming events for user dashboard");
        return eventRepository.findByStartTimeAfterAndStatusOrderByStartTimeAsc(LocalDateTime.now(), "UPCOMING")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Event mapToEntity(EventDTO dto) {
        if (dto == null)
            return null;
        return Event.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .location(dto.getLocation())
                .eventType(dto.getEventType() != null ? dto.getEventType() : "OFFLINE")
                .meetingLink(dto.getMeetingLink())
                .isNew(dto.isNew())
                .registeredCount(dto.getRegisteredCount() != null ? dto.getRegisteredCount() : 0)
                .status(dto.getStatus() != null ? dto.getStatus() : "UPCOMING")
                .build();
    }

    private EventDTO mapToDTO(Event entity) {
        if (entity == null)
            return null;
        return EventDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .location(entity.getLocation())
                .eventType(entity.getEventType())
                .meetingLink(entity.getMeetingLink())
                .isNew(entity.isNew())
                .registeredCount(entity.getRegisteredCount())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
