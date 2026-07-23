package com.punarmilan.controller;

import com.punarmilan.dto.SubscriptionDetailsDTO;
import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.entity.UserSubscription;
import com.punarmilan.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final UserSubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @PostMapping("/subscribe/{planId}")
    public ResponseEntity<UserSubscription> subscribe(@PathVariable Long planId) {
        return ResponseEntity.ok(subscriptionService.subscribe(planId));
    }

    @GetMapping("/current")
    public ResponseEntity<UserSubscription> getCurrent() {
        return ResponseEntity.ok(subscriptionService.getCurrentSubscription());
    }

    @GetMapping("/details")
    public ResponseEntity<SubscriptionDetailsDTO> getDetails() {
        return ResponseEntity.ok(subscriptionService.getSubscriptionDetails());
    }

    @PostMapping("/track-contact-view/{profileId}")
    public ResponseEntity<SubscriptionDetailsDTO> trackContactView(@PathVariable Long profileId) {
        return ResponseEntity.ok(subscriptionService.trackContactView(profileId));
    }
}
