package com.punarmilan.service;

import com.punarmilan.entity.ContactMessage;
import com.punarmilan.entity.enums.ContactStatus;
import com.punarmilan.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;

    @Transactional
    public ContactMessage saveMessage(ContactMessage message) {
        message.setStatus(ContactStatus.NEW);
        return repository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAll();
    }

    @Transactional
    public ContactMessage updateStatus(Long id, ContactStatus status) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
        message.setStatus(status);
        return repository.save(message);
    }
}
