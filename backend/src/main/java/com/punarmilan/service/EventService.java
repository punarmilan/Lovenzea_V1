package com.punarmilan.service;

import com.punarmilan.dto.EventDTO;
import java.util.List;

public interface EventService {
    EventDTO createEvent(EventDTO eventDTO);

    EventDTO updateEvent(Long id, EventDTO eventDTO);

    void deleteEvent(Long id);

    EventDTO getEventById(Long id);

    List<EventDTO> getAllEvents();

    List<EventDTO> getUpcomingEvents();
}
