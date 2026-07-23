package com.punarmilan.controller;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {

    private final MatchService matchService;
    private final AuthUtil authUtil;

    @GetMapping("/online-matches")
    public ResponseEntity<Page<ProfileDTO>> getOnlineMatches(Pageable pageable) {
        return ResponseEntity.ok(matchService.getOnlineMatches(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/online-accepted")
    public ResponseEntity<Page<ProfileDTO>> getOnlineAccepted(Pageable pageable) {
        return ResponseEntity.ok(matchService.getOnlineAcceptedMembers(authUtil.getCurrentUser(), pageable));
    }

    @GetMapping("/shortlisted")
    public ResponseEntity<Page<ProfileDTO>> getShortlisted(Pageable pageable) {
        return ResponseEntity.ok(matchService.getShortlistedMembers(authUtil.getCurrentUser(), pageable));
    }
}
