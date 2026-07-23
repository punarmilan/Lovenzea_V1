package com.punarmilan.controller;

import com.punarmilan.dto.ConnectionRequestDTO;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.entity.enums.RequestType;
import com.punarmilan.security.AuthUtil;
import com.punarmilan.service.ConnectionRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
@Slf4j
public class ConnectionRequestController {

    private final ConnectionRequestService connectionRequestService;
    private final AuthUtil authUtil;

    @PostMapping("/send/{receiverProfileId}")
    public ResponseEntity<Void> sendRequest(@PathVariable Long receiverProfileId) {
        log.info("Request to send connection to profile {}", receiverProfileId);
        connectionRequestService.sendRequest(authUtil.getCurrentUser(), receiverProfileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/photo/send/{receiverProfileId}")
    public ResponseEntity<Void> sendPhotoRequest(@PathVariable Long receiverProfileId) {
        log.info("Request to send photo request to profile {}", receiverProfileId);
        connectionRequestService.sendPhotoRequest(authUtil.getCurrentUser(), receiverProfileId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/withdraw/{receiverProfileId}")
    public ResponseEntity<Void> withdrawRequest(@PathVariable Long receiverProfileId) {
        log.info("Request to withdraw connection request from profile {}", receiverProfileId);
        connectionRequestService.withdrawRequest(authUtil.getCurrentUser(), receiverProfileId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<Void> acceptRequest(@PathVariable Long requestId) {
        log.info("Request to accept connection {}", requestId);
        connectionRequestService.acceptRequest(authUtil.getCurrentUser(), requestId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/decline/{requestId}")
    public ResponseEntity<Void> declineRequest(@PathVariable Long requestId) {
        log.info("Request to decline connection {}", requestId);
        connectionRequestService.declineRequest(authUtil.getCurrentUser(), requestId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/received")
    public ResponseEntity<List<ConnectionRequestDTO>> getReceivedRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type) {
        log.info("Request to fetch received connections with status {} and type {}", status, type);
        return ResponseEntity.ok(connectionRequestService.getReceivedRequests(authUtil.getCurrentUser(), status, type));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ConnectionRequestDTO>> getSentRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type) {
        log.info("Request to fetch sent connections with status {} and type {}", status, type);
        return ResponseEntity.ok(connectionRequestService.getSentRequests(authUtil.getCurrentUser(), status, type));
    }
}
