package com.punarmilan.controller;

import com.punarmilan.dto.EventRegistrationDTO;
import com.punarmilan.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventRegistrationController {

    private final EventRegistrationService registrationService;

    @PostMapping("/events/register/{eventId}")
    public ResponseEntity<EventRegistrationDTO> register(@PathVariable Long eventId, @RequestParam Long userId) {
        return ResponseEntity.ok(registrationService.registerForEvent(eventId, userId));
    }

    @GetMapping("/events/check-registration/{eventId}")
    public ResponseEntity<Boolean> checkRegistration(@PathVariable Long eventId, @RequestParam Long userId) {
        return ResponseEntity.ok(registrationService.isUserRegistered(eventId, userId));
    }

    @GetMapping("/admin/events/{eventId}/registrants")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR')")
    public ResponseEntity<List<EventRegistrationDTO>> getRegistrants(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrantsByEvent(eventId));
    }
}
