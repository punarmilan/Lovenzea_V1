package com.punarmilan.service.impl;

import com.punarmilan.dto.SupportTicketDTO;
import com.punarmilan.entity.SupportTicket;
import com.punarmilan.entity.User;
import com.punarmilan.repository.SupportTicketRepository;
import com.punarmilan.repository.UserRepository;
import com.punarmilan.service.AdminLogService;
import com.punarmilan.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SupportServiceImpl implements SupportService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AdminLogService adminLogService;

    @Override
    @Transactional
    public SupportTicketDTO createTicket(SupportTicketDTO ticketDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(ticketDTO.getSubject())
                .message(ticketDTO.getMessage())
                .priority(ticketDTO.getPriority() != null ? ticketDTO.getPriority() : "MEDIUM")
                .status("OPEN")
                .build();

        SupportTicket savedTicket = ticketRepository.save(ticket);
        return mapToDTO(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportTicketDTO> getUserTickets(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("User not found"));

        // We need a method in repository for this
        return ticketRepository.findByUser(user, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupportTicketDTO> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public void respondToTicket(Long id, String response) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new com.punarmilan.exception.ResourceNotFoundException("Ticket not found"));

        ticket.setAdminResponse(response);
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());

        ticketRepository.save(ticket);
        adminLogService.logAction("RESPOND_TICKET", "Responded to support ticket ID: " + id);
    }

    private SupportTicketDTO mapToDTO(SupportTicket ticket) {
        return SupportTicketDTO.builder()
                .id(ticket.getId())
                .userId(ticket.getUser().getId())
                .userName(ticket.getUser().getProfile() != null ? ticket.getUser().getProfile().getFullName()
                        : "User " + ticket.getUser().getId())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .adminResponse(ticket.getAdminResponse())
                .createdAt(ticket.getCreatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .build();
    }
}
