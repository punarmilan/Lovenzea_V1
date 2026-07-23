package com.punarmilan.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "subscription_plans")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer durationInDays;

    private String durationLabel; // e.g., "3 Months", "6 Months"

    private Integer connects; // Number of messages/contacts allowed

    @Builder.Default
    private Boolean active = true;

    private Integer discountPercentage;

    private String highlightTag; // e.g., "Top Seller", "Best Value"

    @Column(name = "features", columnDefinition = "TEXT")
    private String features; // Comma separated or JSON string

    @Column(name = "plan_type")
    @Builder.Default
    private String planType = "PREMIUM"; // e.g., "PREMIUM", "SPECIAL_SERVICE"
}
