package com.punarmilan.config;

import com.punarmilan.entity.SubscriptionPlan;
import com.punarmilan.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        if (planRepository.count() > 0) {
            System.out.println("Subscription Plans already seeded.");
            return;
        }
        System.out.println("Seeding Subscription Plans...");
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
                    .planType("PREMIUM")
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
                    .planType("PREMIUM")
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
                    .planType("PREMIUM")
                    .build();

            // Special Service Plans
            SubscriptionPlan ssSilver = SubscriptionPlan.builder()
                    .name("Silver Package")
                    .description("10 DAYS PROGRAM")
                    .price(new BigDecimal("25000"))
                    .durationInDays(10)
                    .durationLabel("10 DAYS PROGRAM")
                    .connects(0)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag(null)
                    .features("VIP Privacy One-On-One Support,100% Confidentiality")
                    .planType("SPECIAL_SERVICE")
                    .build();

            SubscriptionPlan ssGold = SubscriptionPlan.builder()
                    .name("Gold Package")
                    .description("30 DAYS PROGRAM")
                    .price(new BigDecimal("60000"))
                    .durationInDays(30)
                    .durationLabel("30 DAYS PROGRAM")
                    .connects(0)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag(null)
                    .features("VIP Privacy One-On-One Support,100% Confidentiality,Match Making Success Assured")
                    .planType("SPECIAL_SERVICE")
                    .build();

            SubscriptionPlan ssPlatinum = SubscriptionPlan.builder()
                    .name("Platinum Package")
                    .description("60 DAYS PROGRAM")
                    .price(new BigDecimal("125000"))
                    .durationInDays(60)
                    .durationLabel("60 DAYS PROGRAM")
                    .connects(0)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag("Most Popular")
                    .features("VIP Privacy,100% Confidentiality,Photoshoot,Diet & Nutrition")
                    .planType("SPECIAL_SERVICE")
                    .build();

            SubscriptionPlan ssDiamondElite = SubscriptionPlan.builder()
                    .name("Diamond Elite")
                    .description("90 DAYS PROGRAM")
                    .price(new BigDecimal("300000"))
                    .durationInDays(90)
                    .durationLabel("90 DAYS PROGRAM")
                    .connects(0)
                    .active(true)
                    .discountPercentage(0)
                    .highlightTag("Exclusive")
                    .features("VIP Privacy,100% Confidentiality,Medical Checkups,Post-Marriage Support")
                    .planType("SPECIAL_SERVICE")
                    .build();

            planRepository.saveAll(Arrays.asList(basic, gold, diamond, ssSilver, ssGold, ssPlatinum, ssDiamondElite));
            System.out.println("Seeding completed!");
    }
}
