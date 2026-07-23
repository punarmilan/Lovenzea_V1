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
public class SubscriptionDetailsDTO {
    private String planName;
    private LocalDateTime expiryDate;
    private Integer totalConnects;
    private Integer usedConnects;
    private Integer balance;
    private Boolean active;
}
