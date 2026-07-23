package com.punarmilan.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VipOrderRequest {
    private BigDecimal amount;
    private String packageType;
    private Long planId;
    private String fullName;
    private String phoneNumber;
    private String comments;
}
