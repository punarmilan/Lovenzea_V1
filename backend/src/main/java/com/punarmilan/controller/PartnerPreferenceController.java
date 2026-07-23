package com.punarmilan.controller;

import com.punarmilan.dto.PartnerPreferenceDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.PartnerPreferenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@Slf4j
public class PartnerPreferenceController {

    private final PartnerPreferenceService preferenceService;
    private final AuthUtil authUtil;

    @GetMapping("/me")
    public ResponseEntity<PartnerPreferenceDTO> getMyPreferences() {
        log.info("Fetching preferences for current user");
        return ResponseEntity.ok(preferenceService.getMyPreferences(authUtil.getCurrentUser()));
    }

    @PostMapping
    public ResponseEntity<PartnerPreferenceDTO> updatePreferences(@RequestBody Map<String, Object> updates) {
        log.info("Updating preferences for current user with {} fields", updates.size());
        return ResponseEntity.ok(preferenceService.updatePreferences(authUtil.getCurrentUser(), updates));
    }
}
