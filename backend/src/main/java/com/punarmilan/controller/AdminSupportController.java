package com.punarmilan.controller;

import com.punarmilan.dto.SupportTicketDTO;
import com.punarmilan.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/support")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUB_ADMIN')")
public class AdminSupportController {

    private final SupportService supportService;

    @GetMapping("/tickets")
    public ResponseEntity<Page<SupportTicketDTO>> getAllTickets(Pageable pageable) {
        return ResponseEntity.ok(supportService.getAllTickets(pageable));
    }

    @PostMapping("/tickets/{id}/respond")
    public ResponseEntity<Void> respondToTicket(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        supportService.respondToTicket(id, payload.get("response"));
        return ResponseEntity.ok().build();
    }
}
