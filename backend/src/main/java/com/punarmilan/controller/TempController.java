package com.punarmilan.controller;

import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cache.annotation.CacheEvict;

import java.math.BigDecimal;
import java.util.Arrays;

@RestController
@RequestMapping("/api/temp")
@RequiredArgsConstructor
public class TempController {

    private final SubscriptionPlanRepository planRepository;
    private final com.punarmilan.repository.UserRepository userRepository;

    @GetMapping("/seed")
    @CacheEvict(value = "subscription_plans", allEntries = true)
    public ResponseEntity<String> seed() {
        if (planRepository.count() == 0) {
            SubscriptionPlan basic = SubscriptionPlan.builder()
                    .name("Basic Plan")
                    .description("Standard profile features")
                    .price(new BigDecimal("999"))
                    .durationInDays(30)
                    .durationLabel("1 Month")
                    .connects(50)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag(null)
                    .features("Basic Support,50 Connects,Standard Visibility")
                    .build();

            SubscriptionPlan gold = SubscriptionPlan.builder()
                    .name("Gold Plan")
                    .description("Premium profile features")
                    .price(new BigDecimal("2499"))
                    .durationInDays(90)
                    .durationLabel("3 Months")
                    .connects(200)
                    .active(true)
                    .discountPercentage(10)
                    .highlightTag("Top Seller")
                    .features("Priority Support,200 Connects,High Visibility,Profile Boosting")
                    .build();

            SubscriptionPlan diamond = SubscriptionPlan.builder()
                    .name("Diamond Plan")
                    .description("Elite profile features")
                    .price(new BigDecimal("4999"))
                    .durationInDays(180)
                    .durationLabel("6 Months")
                    .connects(500)
                    .active(true)
                    .discountPercentage(20)
                    .highlightTag("Best Value")
                    .features("24/7 Dedicated Support,500 Connects,Maximum Visibility,Free Profile Boosting,Personal Relationship Manager")
                    .build();

            planRepository.saveAll(Arrays.asList(basic, gold, diamond));
            return ResponseEntity.ok("Seeded Membership Plans successfully");
        }
        return ResponseEntity.ok("Plans already exist");

    }
    @GetMapping("/seed-special")
    @CacheEvict(value = "subscription_plans", allEntries = true)
    public ResponseEntity<String> seedSpecial() {
        // Only seed if no special plans exist
        if (planRepository.count() <= 3) {
            SubscriptionPlan silver = SubscriptionPlan.builder()
                    .name("Silver Package")
                    .description("Standard special service")
                    .price(new BigDecimal("25000"))
                    .durationInDays(2)
                    .durationLabel("2 Days")
                    .connects(0)
                    .active(true)
                    .planType("SPECIAL_SERVICE")
                    .features("VIP Private Coaching Room,100% Confidentiality")
                    .build();

            SubscriptionPlan gold = SubscriptionPlan.builder()
                    .name("Gold Package")
                    .description("Premium special service")
                    .price(new BigDecimal("60000"))
                    .durationInDays(5)
                    .durationLabel("5 Days")
                    .connects(0)
                    .active(true)
                    .planType("SPECIAL_SERVICE")
                    .highlightTag("Most Popular")
                    .features("VIP Private Coaching Room,100% Confidentiality,Personalized Couple Assessment Report")
                    .build();

            SubscriptionPlan platinum = SubscriptionPlan.builder()
                    .name("Platinum Package")
                    .description("Elite special service")
                    .price(new BigDecimal("125000"))
                    .durationInDays(10)
                    .durationLabel("10 Days")
                    .connects(0)
                    .active(true)
                    .planType("SPECIAL_SERVICE")
                    .features("VIP Private Coaching Room,100% Confidentiality,Personalized Couple Assessment Report,Premium Training Workbook,Welcome Kit")
                    .build();

            SubscriptionPlan diamondElite = SubscriptionPlan.builder()
                    .name("Diamond Elite")
                    .description("Custom elite service")
                    .price(new BigDecimal("300000"))
                    .durationInDays(0)
                    .durationLabel("Custom")
                    .connects(0)
                    .active(true)
                    .planType("SPECIAL_SERVICE")
                    .features("VIP Private Coaching Room,100% Confidentiality,Personalized Couple Assessment Report,Premium Training Workbook,Welcome Kit,Refreshments,Training Completion Certificate,Post-Marriage Support")
                    .build();

            planRepository.saveAll(Arrays.asList(silver, gold, platinum, diamondElite));
            return ResponseEntity.ok("Seeded Special Service Plans successfully");
        }
        return ResponseEntity.ok("Special Plans might already exist");
    }
    
    @GetMapping("/debug-user")
    public ResponseEntity<?> debugUser(@org.springframework.web.bind.annotation.RequestParam String email) {
        java.util.Optional<com.punarmilan.entity.User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            com.punarmilan.entity.User user = userOpt.get();
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("email", user.getEmail());
            data.put("emailOtp", user.getEmailOtp());
            data.put("emailOtpExpiry", user.getEmailOtpExpiry());
            data.put("now", java.time.LocalDateTime.now());
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.notFound().build();
    }
}
