package com.punarmilan.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class PaymentOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String key; // Razorpay Key ID
}
