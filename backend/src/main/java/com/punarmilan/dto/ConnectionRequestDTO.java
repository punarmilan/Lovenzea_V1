package com.punarmilan.dto;

import com.punarmilan.entity.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectionRequestDTO {
    private Long id;
    private ProfileDTO senderProfile;
    private ProfileDTO receiverProfile;
    private Long senderId;
    private Long receiverId;
    private Long senderProfileId;
    private Long receiverProfileId;
    private RequestStatus status;
    private com.punarmilan.entity.enums.RequestType requestType;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
