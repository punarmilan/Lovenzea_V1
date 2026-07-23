package com.punarmilan.service.impl;

import com.punarmilan.dto.EventRegistrationDTO;
import com.punarmilan.entity.Event;
import com.punarmilan.entity.EventRegistration;
import com.punarmilan.entity.User;
import com.punarmilan.repository.EventRegistrationRepository;
import com.punarmilan.repository.EventRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.EmailService;
import com.punarmilan.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public EventRegistrationDTO registerForEvent(Long eventId, Long userId) {
        log.info("Registering user {} for event {}", userId, eventId);

        if (registrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new com.punarmilan.exception.BadRequestException("User already registered for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .user(user)
                .build();

        EventRegistration savedRegistration = registrationRepository.save(registration);

        // Update event registered count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // Send registration confirmation email
        sendRegistrationEmail(savedRegistration);

        return mapToDTO(savedRegistration);
    }

    private void sendRegistrationEmail(EventRegistration registration) {
        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("userName", registration.getUser().getProfile() != null ? registration.getUser().getProfile().getFullName() : "User");
            variables.put("eventTitle", registration.getEvent().getTitle());
            variables.put("eventDate", registration.getEvent().getStartTime());
            variables.put("eventLocation", registration.getEvent().getLocation());
            variables.put("eventType", registration.getEvent().getEventType());
            variables.put("meetingLink", registration.getEvent().getMeetingLink());

            emailService.sendHtmlEmail(
                registration.getUser().getEmail(),
                "Registration Confirmed: " + registration.getEvent().getTitle(),
                "event-registration-confirmation",
                variables
            );
        } catch (Exception e) {
            log.error("Failed to send registration email", e);
        }
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void sendScheduledReminders() {
        log.info("Starting scheduled event reminders task");
        LocalDateTime twentyFourHoursFromNow = LocalDateTime.now().plusHours(24);
        
        List<EventRegistration> upcomingRegistrations = registrationRepository
            .findByReminderSentFalseAndEventStartTimeBefore(twentyFourHoursFromNow);

        log.info("Found {} registrations needing reminders", upcomingRegistrations.size());

        for (EventRegistration reg : upcomingRegistrations) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("userName", reg.getUser().getProfile() != null ? reg.getUser().getProfile().getFullName() : "User");
                variables.put("eventTitle", reg.getEvent().getTitle());
                variables.put("eventDate", reg.getEvent().getStartTime());
                variables.put("eventLocation", reg.getEvent().getLocation());
                variables.put("meetingLink", reg.getEvent().getMeetingLink());

                emailService.sendHtmlEmail(
                    reg.getUser().getEmail(),
                    "Reminder: " + reg.getEvent().getTitle() + " starts soon!",
                    "event-reminder",
                    variables
                );

                reg.setReminderSent(true);
                registrationRepository.save(reg);
            } catch (Exception e) {
                log.error("Error sending reminder for registration {}", reg.getId(), e);
            }
        }
    }

    @Override
    public boolean isUserRegistered(Long eventId, Long userId) {
        return registrationRepository.existsByEventIdAndUserId(eventId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getRegistrantsByEvent(Long eventId) {
        log.info("Fetching registrants for event {}", eventId);
        return registrationRepository.findByEventId(eventId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EventRegistrationDTO mapToDTO(EventRegistration registration) {
        return EventRegistrationDTO.builder()
                .id(registration.getId())
                .eventId(registration.getEvent().getId())
                .userId(registration.getUser().getId())
                .userName(registration.getUser().getProfile() != null ? registration.getUser().getProfile().getFullName() : "N/A")
                .userEmail(registration.getUser().getEmail())
                .userMobile(registration.getUser().getMobileNumber())
                .registrationDate(registration.getRegistrationDate())
                .build();
    }
}
