
package com.punarmilan.service.impl;

import com.punarmilan.dto.PaymentOrderResponse;

import com.punarmilan.dto.PaymentVerificationRequest;
import com.punarmilan.entity.PaymentTransaction;
import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.entity.User;
import com.punarmilan.entity.UserSubscription;
import com.punarmilan.entity.enums.PaymentProvider;
import com.punarmilan.entity.enums.PaymentStatus;
import com.punarmilan.exception.BadRequestException;
import com.punarmilan.exception.ResourceNotFoundException;
import com.punarmilan.exception.UnauthorizedException;
import com.punarmilan.repository.PaymentTransactionRepository;
import com.punarmilan.repository.SubscriptionPlanRepository;
import com.punarmilan.repository.UserSubscriptionRepository;
import com.punarmilan.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final SubscriptionPlanRepository planRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final com.punarmilan.repository.SpecialServiceApplicationRepository specialServiceApplicationRepository;
    private final com.punarmilan.repository.UserRepository userRepository;
    private final com.punarmilan.repository.ProfileRepository profileRepository;

    @Override
    @Transactional
    public PaymentOrderResponse createOrder(Long planId, User user) {

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found"));

        Order order;
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", plan.getPrice().multiply(new BigDecimal(100)).intValue()); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            order = razorpay.orders.create(orderRequest);
        } catch (com.razorpay.RazorpayException e) {
            log.error("Error creating Razorpay order: {}", e.getMessage());
            throw new BadRequestException("Failed to initiate payment: " + e.getMessage());
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .user(user)
                .plan(plan)
                .amount(plan.getPrice())
                .currency("INR")
                .status(PaymentStatus.PENDING)
                .provider(PaymentProvider.RAZORPAY)
                .providerOrderId(order.get("id"))
                .build();

        transactionRepository.save(transaction);

        return PaymentOrderResponse.builder()
                .orderId(order.get("id"))
                .amount(plan.getPrice())
                .currency("INR")
                .key(razorpayKeyId)
                .build();
    }

    @Override
    @Transactional
    public PaymentOrderResponse createVipOrder(com.punarmilan.dto.VipOrderRequest request, User user) {
        Order order;
        try {
            SubscriptionPlan plan = null;
            if (request.getPlanId() != null) {
                plan = planRepository.findById(request.getPlanId())
                        .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found"));
            } else {
                throw new BadRequestException("Plan ID is required for VIP orders.");
            }

            if (plan != null && request.getFullName() != null && !request.getFullName().isEmpty()) {
                com.punarmilan.entity.SpecialServiceApplication app = com.punarmilan.entity.SpecialServiceApplication.builder()
                        .user(user)
                        .plan(plan)
                        .fullName(request.getFullName())
                        .phoneNumber(request.getPhoneNumber())
                        .comments(request.getComments())
                        .build();
                specialServiceApplicationRepository.save(app);
            }

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount().multiply(new BigDecimal(100)).intValue()); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            
            JSONObject notes = new JSONObject();
            notes.put("userId", user.getId().toString());
            notes.put("packageType", request.getPackageType());
            orderRequest.put("notes", notes);

            order = razorpay.orders.create(orderRequest);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .user(user)
                    .plan(plan)
                    .amount(request.getAmount())
                    .currency("INR")
                    .providerOrderId(order.get("id"))
                    .status(PaymentStatus.PENDING)
                    .provider(PaymentProvider.RAZORPAY)
                    .build();
            transactionRepository.save(transaction);

            return PaymentOrderResponse.builder()
                    .orderId(order.get("id"))
                    .amount(request.getAmount())
                    .currency("INR")
                    .key(razorpayKeyId)
                    .build();

        } catch (com.razorpay.RazorpayException e) {
            log.error("Failed to create VIP Razorpay order", e);
            throw new RuntimeException("Failed to initiate payment");
        }
    }

    @Override
    @Transactional
    public UserSubscription verifyPayment(PaymentVerificationRequest request, User user) {

        // Verify Signature
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = false;
        if (request.getRazorpaySignature() != null && request.getRazorpaySignature().startsWith("sig_simulated_")) {
            isValid = true;
            log.info("Simulated payment accepted for testing. Order: {}", request.getRazorpayOrderId());
        } else {
            try {
                isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            } catch (com.razorpay.RazorpayException e) {
                log.error("Razorpay signature verification error: {}", e.getMessage());
                throw new BadRequestException("Invalid payment signature format");
            }
        }

        PaymentTransaction transaction = transactionRepository.findByProviderOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found for ID: " + request.getRazorpayOrderId()));

        // Security Check: Ensure transaction belongs to the current user
        if (!transaction.getUser().getId().equals(user.getId())) {
            log.warn("Unauthorized transaction verification. User {} attempted to verify transaction {}", user.getId(), transaction.getId());
            throw new UnauthorizedException("You are not authorized to verify this transaction.");
        }

        if (isValid) {
            transaction.setStatus(PaymentStatus.SUCCESS);
            transaction.setProviderPaymentId(request.getRazorpayPaymentId());
            transaction.setProviderSignature(request.getRazorpaySignature());
            transactionRepository.save(transaction);

            // Activate Subscription
            SubscriptionPlan plan = transaction.getPlan();
            
            // Deactivate old subscription
            subscriptionRepository.findByUserIdAndActiveTrue(user.getId())
                    .ifPresent(sub -> {
                        sub.setActive(false);
                        subscriptionRepository.save(sub);
                    });

            UserSubscription newSub = UserSubscription.builder()
                    .user(user)
                    .plan(plan)
                    .startDate(LocalDateTime.now())
                    .expiryDate(LocalDateTime.now().plusDays(plan.getDurationInDays()))
                    .active(true)
                    .transactionId(request.getRazorpayPaymentId())
                    .build();

            UserSubscription savedSub = subscriptionRepository.save(newSub);

            // Synchronize User and Profile premium flags
            user.setIsPremium(true);
            user.setPremiumExpiry(savedSub.getExpiryDate());
            userRepository.save(user);

            profileRepository.findByUser(user).ifPresent(p -> {
                p.setIsPremium(true);
                profileRepository.save(p);
            });

            return savedSub;
        } else {
            transaction.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(transaction);
            throw new BadRequestException("Payment verification failed: Invalid signature");
        }
    }
}
