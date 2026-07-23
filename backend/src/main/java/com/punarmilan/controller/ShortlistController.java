package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.ShortlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shortlist")
@RequiredArgsConstructor
@Slf4j
public class ShortlistController {

    private final ShortlistService shortlistService;
    private final AuthUtil authUtil;

    @PostMapping("/{profileId}")
    public ResponseEntity<Map<String, String>> addToShortlist(@PathVariable Long profileId) {
        log.info("Adding profile {} to shortlist for current user", profileId);
        shortlistService.addToShortlist(authUtil.getCurrentUser(), profileId);
        return ResponseEntity.ok(Map.of("message", "Profile added to shortlist"));
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Map<String, String>> removeFromShortlist(@PathVariable Long profileId) {
        log.info("Removing profile {} from shortlist for current user", profileId);
        shortlistService.removeFromShortlist(authUtil.getCurrentUser(), profileId);
        return ResponseEntity.ok(Map.of("message", "Profile removed from shortlist"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProfileDTO>> getMyShortlist() {
        log.info("Fetching shortlist for current user");
        return ResponseEntity.ok(shortlistService.getMyShortlist(authUtil.getCurrentUser()));
    }

    @GetMapping("/check/{profileId}")
    public ResponseEntity<Map<String, Boolean>> isShortlisted(@PathVariable Long profileId) {
        boolean isShortlisted = shortlistService.isShortlisted(authUtil.getCurrentUser(), profileId);
        return ResponseEntity.ok(Map.of("isShortlisted", isShortlisted));
    }
}
