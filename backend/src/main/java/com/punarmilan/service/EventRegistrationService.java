package com.punarmilan.service;

import com.punarmilan.dto.EventRegistrationDTO;
import java.util.List;

public interface EventRegistrationService {
    EventRegistrationDTO registerForEvent(Long eventId, Long userId);
    boolean isUserRegistered(Long eventId, Long userId);
    List<EventRegistrationDTO> getRegistrantsByEvent(Long eventId);
}
