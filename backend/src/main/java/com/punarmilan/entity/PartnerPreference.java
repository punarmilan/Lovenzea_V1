package com.punarmilan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partner_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer minAge;
    private Integer maxAge;
    private String minHeight;
    private String maxHeight;

    private String preferredReligion;
    private String preferredCaste;
    private String preferredSubCaste;
    private String preferredMotherTongue;

    private String minEducationLevel;
    private String preferredEducationField;
    private String preferredCountry;
    private String preferredState;
    private String preferredCity;

    private String occupation;
    private String workingWith;
    private String professionArea;
    private String minAnnualIncome;

    private String maritalStatus;
    private String preferredDiet;
    private String drinkingHabit;
    private String smokingHabit;

    private String profileManagedBy;
    @Builder.Default
    private Boolean preferWorkingProfessional = false;
    @Builder.Default
    private Boolean preferNri = false;
    @Builder.Default
    private Boolean showVerifiedOnly = true;
    @Builder.Default
    private Boolean enableAutoMatch = true;
    @Builder.Default
    private Integer matchScoreThreshold = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
