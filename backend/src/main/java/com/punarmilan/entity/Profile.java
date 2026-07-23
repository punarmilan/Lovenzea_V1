package com.punarmilan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profiles", indexes = {
        @Index(name = "idx_profile_user", columnList = "user_id"),
        @Index(name = "idx_profile_gender", columnList = "gender"),
        @Index(name = "idx_profile_age", columnList = "age"),
        @Index(name = "idx_profile_religion", columnList = "religion"),
        @Index(name = "idx_profile_caste", columnList = "caste"),
        @Index(name = "idx_profile_state", columnList = "state"),
        @Index(name = "idx_profile_city", columnList = "city"),
        @Index(name = "idx_profile_visibility", columnList = "profileVisibility"),
        @Index(name = "idx_profile_verification", columnList = "verificationStatus"),
        @Index(name = "idx_profile_marital", columnList = "maritalStatus")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "profile_id", unique = true, length = 20)
    private String profileId;

    @Column(name = "full_name")
    private String fullName;

    private Integer age;
    private String gender;
    private String height;
    private String weight;
    private String maritalStatus;
    private String motherTongue;

    // Religious Background
    private String religion;
    private String caste;
    private String subCaste;
    private String gotra;
    private String manglikStatus;
    private String dateOfBirth;
    private String timeOfBirth;
    private String placeOfBirth;
    private String nakshatra;
    private String rashi;

    // Family Details
    private String fatherStatus;
    private String motherStatus;
    private Integer brothersCount;
    private Integer sistersCount;
    private String familyFinancialStatus;
    private String familyLocation;
    private String educationLevel;
    private String educationField;
    private String college;
    private String occupation;
    private String company;
    private String annualIncome;
    private String workingCity;
    private String workingWith;

    // Location
    private String city;
    private String state;
    private String country;
    private String address;
    private String zipCode;
    private String residencyStatus;
    private String grewUpIn;

    // Lifestyle
    private String diet;
    private String smokingHabit;
    private String drinkingHabit;
    private String bloodGroup;
    @Column(columnDefinition = "TEXT")
    private String healthInformation;
    private String disability;

    @Column(columnDefinition = "TEXT")
    private String aboutMe;

    @Column(columnDefinition = "TEXT")
    private String hobbies;

    // Privacy & Metadata
    @Builder.Default
    private String profileVisibility = "Public";
    @Builder.Default
    private String profilePhotoVisibility = "ALL_MEMBERS";
    @Builder.Default
    private String albumPhotoVisibility = "LIKED_AND_PREMIUM";
    @Builder.Default
    private String contactDisplayStatus = "Only Premium Members";
    @Builder.Default
    private String astroVisibility = "ALL_MEMBERS";
    @Builder.Default
    private String displayNameVisibility = "show-all";
    @Builder.Default
    private String emailVisibility = "all-premium";
    @Builder.Default
    private String dobVisibility = "full";
    @Builder.Default
    private String annualIncomeVisibility = "all-members";
    @Builder.Default
    private String shortlistVisibility = "let-know";
    @Builder.Default
    private Boolean doNotDisturb = false;

    @Column(columnDefinition = "TEXT")
    private String connectMessage;

    @Column(columnDefinition = "TEXT")
    private String acceptMessage;

    @Column(columnDefinition = "TEXT")
    private String notificationSettings;

    @Builder.Default
    private String profileCreatedBy = "Self";
    @Builder.Default
    private Boolean isPremium = false;
    @Column(columnDefinition = "TEXT")
    private String profilePhotoUrl;
    @Column(columnDefinition = "TEXT")
    private String photoUrl2;
    @Column(columnDefinition = "TEXT")
    private String photoUrl3;
    @Column(columnDefinition = "TEXT")
    private String photoUrl4;
    @Column(columnDefinition = "TEXT")
    private String photoUrl5;
    @Column(columnDefinition = "TEXT")
    private String photoUrl6;
    @Builder.Default
    private Integer photoCount = 0;
    @Builder.Default
    private Boolean profileComplete = false;

    // Verification
    @Builder.Default
    private String verificationStatus = "UNVERIFIED";
    private String idProofType;
    private String idProofNumber;
    @Column(columnDefinition = "TEXT")
    private String idProofUrl;

    @Builder.Default
    private String photoVerificationStatus = "UNVERIFIED";

    private LocalDateTime verifiedAt;
    private String verifiedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "viewedProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ProfileView> views = new ArrayList<>();

    @OneToMany(mappedBy = "shortlistedProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Shortlist> shortlistedBy = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<DailyMatch> dailyMatches = new ArrayList<>();

    @OneToMany(mappedBy = "viewedProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ContactView> contactViewedBy = new ArrayList<>();
}
