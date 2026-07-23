package com.punarmilan.service;

import com.punarmilan.dto.PaymentOrderResponse;
import com.punarmilan.dto.PaymentVerificationRequest;
import com.punarmilan.entity.UserSubscription;

import com.punarmilan.entity.User;

public interface PaymentService {
    PaymentOrderResponse createOrder(Long planId, User user);
    PaymentOrderResponse createVipOrder(com.punarmilan.dto.VipOrderRequest request, User user);
    UserSubscription verifyPayment(PaymentVerificationRequest request, User user);
}
