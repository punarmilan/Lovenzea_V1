package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationDTO {
    private Long id;
    private Long eventId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userMobile;
    private LocalDateTime registrationDate;
}
