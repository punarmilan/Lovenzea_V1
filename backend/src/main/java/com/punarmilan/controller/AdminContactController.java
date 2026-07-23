package com.punarmilan.controller;

import com.punarmilan.entity.ContactMessage;
import com.punarmilan.entity.enums.ContactStatus;
import com.punarmilan.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUB_ADMIN')")
public class AdminContactController {

    private final ContactMessageService service;

    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(service.getAllMessages());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactMessage> updateStatus(@PathVariable Long id, @RequestParam ContactStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
