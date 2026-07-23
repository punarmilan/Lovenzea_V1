package com.punarmilan.controller;

import com.punarmilan.dto.PaymentOrderResponse;
import com.punarmilan.dto.PaymentVerificationRequest;
import com.punarmilan.entity.UserSubscription;
import com.punarmilan.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.punarmilan.security.AuthUtil;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthUtil authUtil;

    @PostMapping("/create-order/{planId}")
    public ResponseEntity<PaymentOrderResponse> createOrder(@PathVariable Long planId) {
        return ResponseEntity.ok(paymentService.createOrder(planId, authUtil.getCurrentUser()));
    }

    @PostMapping("/create-vip-order")
    public ResponseEntity<PaymentOrderResponse> createVipOrder(@RequestBody com.punarmilan.dto.VipOrderRequest request) {
        return ResponseEntity.ok(paymentService.createVipOrder(request, authUtil.getCurrentUser()));
    }

    @PostMapping("/verify")
    public ResponseEntity<UserSubscription> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request, authUtil.getCurrentUser()));
    }
}
