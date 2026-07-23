package com.punarmilan.controller;

import com.punarmilan.entity.User;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/referral")
@RequiredArgsConstructor
@Slf4j
public class ReferralController {

    private final MailService mailService;
    private final AuthUtil authUtil;
    private final ProfileRepository profileRepository;

    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, String> request) {
        String friendEmail = request.get("email");
        if (friendEmail == null || friendEmail.trim().isEmpty()
                || !friendEmail.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Valid email is required"));
        }

        User currentUser = authUtil.getCurrentUser();
        final String[] senderNameHolder = {"A friend"};

        profileRepository.findByUser(currentUser).ifPresent(p -> {
            if (p.getFullName() != null) {
                senderNameHolder[0] = p.getFullName();
            }
        });

        String senderName = senderNameHolder[0];

        log.info("User {} is inviting {} to join PunarMilan", currentUser.getEmail(), friendEmail);

        try {
            mailService.sendReferralEmail(friendEmail, senderName);
            return ResponseEntity.ok(Map.of("message", "Invitation sent successfully to " + friendEmail));
        } catch (Exception e) {
            log.error("Failed to send referral email: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send invitation"));
        }
    }
}
