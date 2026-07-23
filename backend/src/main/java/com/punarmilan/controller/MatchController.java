package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.MatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
public class MatchController {

    private final MatchService matchService;
    private final AuthUtil authUtil;

    @GetMapping("/new")
    public ResponseEntity<Page<ProfileDTO>> getNewMatches(Pageable pageable) {
        log.info("Request received for new matches");
        return ResponseEntity.ok(matchService.getNewMatches(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/today")
    public ResponseEntity<Page<ProfileDTO>> getTodayMatches(Pageable pageable) {
        log.info("Request received for today's matches");
        return ResponseEntity.ok(matchService.getTodayMatches(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<ProfileDTO>> getAllMatches(Pageable pageable) {
        log.info("Request received for all matches");
        return ResponseEntity.ok(matchService.getAllMatches(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/near-me")
    public ResponseEntity<Page<ProfileDTO>> getNearMeMatches(Pageable pageable) {
        log.info("Request received for near-me matches");
        return ResponseEntity.ok(matchService.getNearMeMatches(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/recently-viewed")
    public ResponseEntity<Page<ProfileDTO>> getRecentlyViewedProfiles(Pageable pageable) {
        log.info("Request received for recently viewed matches");
        return ResponseEntity.ok(matchService.getRecentlyViewedProfiles(authUtil.getCurrentUser(), pageable));
    }

    @org.springframework.web.bind.annotation.GetMapping("/recent-visitors")
    public ResponseEntity<Page<ProfileDTO>> getRecentVisitors(Pageable pageable) {
        log.info("Request received for recent visitors");
        return ResponseEntity.ok(matchService.getRecentVisitors(authUtil.getCurrentUser(), pageable));
    }

    @org.springframework.web.bind.annotation.PostMapping("/view/{profileId}")
    public ResponseEntity<Void> logProfileView(@org.springframework.web.bind.annotation.PathVariable Long profileId) {
        log.info("Request received to log profile view: {}", profileId);
        matchService.logProfileView(authUtil.getCurrentUser(), profileId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preference-match/{profileId}")
    public ResponseEntity<com.punarmilan.dto.PreferenceMatchDTO> getPreferenceMatch(@org.springframework.web.bind.annotation.PathVariable Long profileId) {
        log.info("Request received for preference match with profile: {}", profileId);
        return ResponseEntity.ok(matchService.getPreferenceMatch(authUtil.getCurrentUser(), profileId));
    }
}
