package com.punarmilan.controller;

import com.punarmilan.entity.ContactMessage;
import com.punarmilan.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService service;

    @PostMapping("/submit")
    public ResponseEntity<ContactMessage> submitMessage(@RequestBody ContactMessage message) {
        return ResponseEntity.ok(service.saveMessage(message));
    }
}
