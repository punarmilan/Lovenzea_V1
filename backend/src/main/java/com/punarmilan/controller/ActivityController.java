package com.punarmilan.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @GetMapping("/ping")
    public ResponseEntity<Void> ping() {
        // The JwtAuthenticationFilter will automatically update lastActive
        // for this authenticated request.
        return ResponseEntity.ok().build();
    }
}
