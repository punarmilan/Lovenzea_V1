package com.punarmilan.service.impl;

import com.punarmilan.dto.ConnectionRequestDTO;

import com.punarmilan.dto.ProfileDTO;
import com.punarmilan.entity.ConnectionRequest;
import com.punarmilan.entity.Profile;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.NotificationType;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.entity.enums.RequestType;
import com.punarmilan.exception.BadRequestException;
import com.punarmilan.exception.ResourceNotFoundException;
import com.punarmilan.exception.UnauthorizedException;
import com.punarmilan.repository.ConnectionRequestRepository;
import com.punarmilan.repository.ProfileRepository;
import com.punarmilan.service.ConnectionRequestService;
import com.punarmilan.service.NotificationService;
import com.punarmilan.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionRequestServiceImpl implements ConnectionRequestService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void sendRequest(User sender, Long receiverProfileId) {
        sendInternal(sender, receiverProfileId, RequestType.CONNECTION);
    }

    @Override
    @Transactional
    public void sendPhotoRequest(User sender, Long receiverProfileId) {
        sendInternal(sender, receiverProfileId, RequestType.PHOTO);
    }

    @Override
    @Transactional
    public void withdrawRequest(User sender, Long receiverProfileId) {
        log.info("User {} withdrawing CONNECTION request from profile {}", sender.getId(), receiverProfileId);
        
        Profile receiverProfile = profileRepository.findById(receiverProfileId)
                .or(() -> profileRepository.findByUserId(receiverProfileId))
                .orElseThrow(() -> new ResourceNotFoundException("Receiver profile not found"));
                
        User receiver = receiverProfile.getUser();
        if (receiver == null) {
            throw new ResourceNotFoundException("Receiver user not found for profile");
        }
        
        ConnectionRequest request = connectionRequestRepository
                .findBySenderAndReceiverAndRequestType(sender, receiver, RequestType.CONNECTION)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));
                
        connectionRequestRepository.delete(request);
    }

    private void sendInternal(User sender, Long receiverProfileId, RequestType type) {
        log.info("User {} sending {} request to profile {}", sender.getId(), type, receiverProfileId);

        Profile receiverProfile = profileRepository.findById(receiverProfileId)
                .or(() -> profileRepository.findByUserId(receiverProfileId))
                .orElseThrow(() -> new ResourceNotFoundException("Receiver profile not found"));

        User receiver = receiverProfile.getUser();
        if (receiver == null) {
            throw new ResourceNotFoundException("Receiver user not found for profile");
        }

        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException("You cannot send a request to yourself");
        }

        // Check if request already exists
        connectionRequestRepository.findBySenderAndReceiverAndRequestType(sender, receiver, type).ifPresent(req -> {
            throw new BadRequestException(type + " request already exists with status: " + req.getStatus());
        });

        ConnectionRequest request = ConnectionRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(RequestStatus.PENDING)
                .requestType(type)
                .build();

        connectionRequestRepository.save(request);

        // Fire notification to receiver
        try {
            Profile senderProfile = profileRepository.findByUser(sender).orElse(null);
            String senderName = senderProfile != null ? senderProfile.getFullName() : "Someone";
            String senderPhoto = senderProfile != null && senderProfile.getProfilePhotoUrl() != null
                    ? senderProfile.getProfilePhotoUrl()
                    : null;
            Long refId = senderProfile != null ? senderProfile.getId() : null;

            if (type == RequestType.PHOTO) {
                notificationService.createNotification(
                        receiver,
                        NotificationType.PHOTO_REQUEST,
                        "Photo Request",
                        "sent you a photo request.",
                        senderName, senderPhoto, refId);
            } else {
                notificationService.createNotification(
                        receiver,
                        NotificationType.CONNECTION_REQUEST,
                        "New Connection Request",
                        "sent you a connection request.",
                        senderName, senderPhoto, refId);
            }
        } catch (Exception e) {
            log.warn("Failed to create send-request notification: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void acceptRequest(User receiver, Long requestId) {
        log.info("User {} accepting connection request {}", receiver.getId(), requestId);

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getReceiver().getId().equals(receiver.getId()) && !request.getSender().getId().equals(receiver.getId())) {
            throw new UnauthorizedException("You are not authorized to accept this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request is already " + request.getStatus());
        }

        if (request.getRequestType() == null) {
            request.setRequestType(RequestType.CONNECTION);
        }

        request.setStatus(RequestStatus.ACCEPTED);
        connectionRequestRepository.save(request);

        // Notify the opposite party
        try {
            User otherUser = request.getReceiver().getId().equals(receiver.getId()) ? request.getSender() : request.getReceiver();
            Profile receiverProfile = profileRepository.findByUser(receiver).orElse(null);
            String receiverName = receiverProfile != null ? receiverProfile.getFullName() : "Someone";
            String receiverPhoto = receiverProfile != null && receiverProfile.getProfilePhotoUrl() != null
                    ? receiverProfile.getProfilePhotoUrl()
                    : null;
            Long refId = receiverProfile != null ? receiverProfile.getId() : null;

            notificationService.createNotification(
                    otherUser,
                    NotificationType.CONNECTION_ACCEPTED,
                    "Request Confirmed",
                    "confirmed the connection request.",
                    receiverName, receiverPhoto, refId);
        } catch (Exception e) {
            log.warn("Failed to create connection-accepted notification: {}", e.getMessage());
        }
    }

    @Override
    @Transactional
    public void declineRequest(User receiver, Long requestId) {
        log.info("User {} declining connection request {}", receiver.getId(), requestId);

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getReceiver().getId().equals(receiver.getId())) {
            throw new UnauthorizedException("You are not authorized to decline this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request is already " + request.getStatus());
        }

        if (request.getRequestType() == null) {
            request.setRequestType(RequestType.CONNECTION);
        }

        request.setStatus(RequestStatus.DECLINED);
        connectionRequestRepository.save(request);

        // Notify sender that their request was declined
        try {
            Profile receiverProfile = profileRepository.findByUser(receiver).orElse(null);
            String receiverName = receiverProfile != null ? receiverProfile.getFullName() : "Someone";
            String receiverPhoto = receiverProfile != null && receiverProfile.getProfilePhotoUrl() != null
                    ? receiverProfile.getProfilePhotoUrl()
                    : null;
            Long refId = receiverProfile != null ? receiverProfile.getId() : null;

            notificationService.createNotification(
                    request.getSender(),
                    NotificationType.CONNECTION_DECLINED,
                    "Request Declined",
                    "declined your connection request.",
                    receiverName, receiverPhoto, refId);
        } catch (Exception e) {
            log.warn("Failed to create decline notification: {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionRequestDTO> getReceivedRequests(User user, RequestStatus status, RequestType type) {
        log.info("Fetching received requests for user {} with status {} and type {}", user.getId(), status, type);
        List<ConnectionRequest> requests;
        if (status != null && type != null) {
            requests = connectionRequestRepository.findAllByReceiverAndStatusAndRequestType(user, status, type);
        } else if (status != null) {
            requests = connectionRequestRepository.findAllByReceiverAndStatus(user, status);
        } else {
            requests = connectionRequestRepository.findAllByReceiver(user);
        }
        return requests.stream()
                .map(req -> mapToDTO(req, user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionRequestDTO> getSentRequests(User user, RequestStatus status, RequestType type) {
        log.info("Fetching sent requests for user {} with status {} and type {}", user.getId(), status, type);
        List<ConnectionRequest> requests;
        if (status != null && type != null) {
            requests = connectionRequestRepository.findAllBySenderAndStatusAndRequestType(user, status, type);
        } else if (status != null) {
            requests = connectionRequestRepository.findAllBySenderAndStatus(user, status);
        } else {
            requests = connectionRequestRepository.findAllBySender(user);
        }
        return requests.stream()
                .map(req -> mapToDTO(req, user))
                .collect(Collectors.toList());
    }

    private ConnectionRequestDTO mapToDTO(ConnectionRequest request, User viewer) {
        ProfileDTO senderProfile = null;
        try {
            if (request.getSender() != null) {
                senderProfile = profileService.getProfileByUserId(request.getSender().getId(), viewer);
            }
        } catch (Exception e) {
            log.warn("Could not load sender profile for request {}: {}", request.getId(), e.getMessage());
        }

        ProfileDTO receiverProfile = null;
        try {
            if (request.getReceiver() != null) {
                receiverProfile = profileService.getProfileByUserId(request.getReceiver().getId(), viewer);
            }
        } catch (Exception e) {
            log.warn("Could not load receiver profile for request {}: {}", request.getId(), e.getMessage());
        }

        return ConnectionRequestDTO.builder()
                .id(request.getId())
                .senderProfile(senderProfile)
                .receiverProfile(receiverProfile)
                .senderId(request.getSender() != null ? request.getSender().getId() : null)
                .receiverId(request.getReceiver() != null ? request.getReceiver().getId() : null)
                .senderProfileId(senderProfile != null ? senderProfile.getId() : null)
                .receiverProfileId(receiverProfile != null ? receiverProfile.getId() : null)
                .status(request.getStatus())
                .requestType(request.getRequestType() != null ? request.getRequestType() : RequestType.CONNECTION)
                .createdAt(request.getCreatedAt())
                .build();
    }
}
