package com.punarmilan.service;

import com.punarmilan.dto.SupportTicketDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupportService {
    SupportTicketDTO createTicket(SupportTicketDTO ticketDTO);

    Page<SupportTicketDTO> getUserTickets(Pageable pageable);

    Page<SupportTicketDTO> getAllTickets(Pageable pageable);

    void respondToTicket(Long id, String response);
}
