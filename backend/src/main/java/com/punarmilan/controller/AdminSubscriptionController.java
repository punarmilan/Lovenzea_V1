package com.punarmilan.controller;

import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.repository.SubscriptionPlanRepository;
import com.punarmilan.service.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.cache.annotation.CacheEvict;
import java.util.List;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'SUB_ADMIN')")
public class AdminSubscriptionController {

    private final SubscriptionPlanRepository planRepository;
    private final AdminLogService adminLogService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(planRepository.findAll());
    }

    @PostMapping("/plans")
    @CacheEvict(value = "subscription_plans", allEntries = true)
    public ResponseEntity<SubscriptionPlan> createPlan(@RequestBody SubscriptionPlan plan) {
        SubscriptionPlan saved = planRepository.save(plan);
        adminLogService.logAction("CREATE_PLAN", "Created subscription plan: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/plans/{id}")
    @CacheEvict(value = "subscription_plans", allEntries = true)
    public ResponseEntity<SubscriptionPlan> updatePlan(@PathVariable Long id, @RequestBody SubscriptionPlan plan) {
        plan.setId(id);
        SubscriptionPlan updated = planRepository.save(plan);
        adminLogService.logAction("UPDATE_PLAN", "Updated subscription plan ID: " + id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/plans/{id}")
    @CacheEvict(value = "subscription_plans", allEntries = true)
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        SubscriptionPlan plan = planRepository.findById(id).orElse(null);
        if (plan != null) {
            plan.setActive(false);
            planRepository.save(plan);
            adminLogService.logAction("SOFT_DELETE_PLAN", "Deactivated subscription plan ID: " + id);
        }
        return ResponseEntity.ok().build();
    }
}
