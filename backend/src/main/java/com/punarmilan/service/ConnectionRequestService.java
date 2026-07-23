package com.punarmilan.service;

import com.punarmilan.dto.ConnectionRequestDTO;
import com.punarmilan.entity.User;
import com.punarmilan.entity.enums.RequestStatus;
import com.punarmilan.entity.enums.RequestType;
import java.util.List;

public interface ConnectionRequestService {
    void sendRequest(User sender, Long receiverProfileId);

    void sendPhotoRequest(User sender, Long receiverProfileId);

    void withdrawRequest(User sender, Long receiverProfileId);

    void acceptRequest(User receiver, Long requestId);

    void declineRequest(User receiver, Long requestId);

    List<ConnectionRequestDTO> getReceivedRequests(User user, RequestStatus status, RequestType type);

    List<ConnectionRequestDTO> getSentRequests(User user, RequestStatus status, RequestType type);
}
