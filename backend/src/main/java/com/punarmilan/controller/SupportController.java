package com.punarmilan.controller;

import com.punarmilan.dto.SupportTicketDTO;
import com.punarmilan.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicketDTO> createTicket(@RequestBody SupportTicketDTO ticketDTO) {
        return ResponseEntity.ok(supportService.createTicket(ticketDTO));
    }

    @GetMapping("/tickets")
    public ResponseEntity<Page<SupportTicketDTO>> getUserTickets(Pageable pageable) {
        return ResponseEntity.ok(supportService.getUserTickets(pageable));
    }
}
