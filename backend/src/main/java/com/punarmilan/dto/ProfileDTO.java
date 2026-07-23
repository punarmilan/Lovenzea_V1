package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private Long userId;
    private String email;
    private String mobileNumber;
    private String profileId;
    private String fullName;
    private Integer age;
    private String gender;
    private String height;
    private String weight;
    private String maritalStatus;
    private String motherTongue;
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
    private String city;
    private String state;
    private String country;
    private String address;
    private String zipCode;
    private String residencyStatus;
    private String grewUpIn;
    private String diet;
    private String smokingHabit;
    private String drinkingHabit;
    private String bloodGroup;
    private String healthInformation;
    private String disability;
    private String aboutMe;
    private String hobbies;
    private String profileVisibility;
    private String profilePhotoVisibility;
    private String albumPhotoVisibility;
    private String contactDisplayStatus;
    private String astroVisibility;
    private String displayNameVisibility;
    private String emailVisibility;
    private String dobVisibility;
    private String annualIncomeVisibility;
    private String shortlistVisibility;
    private Boolean doNotDisturb;
    private String connectMessage;
    private String acceptMessage;
    private String notificationSettings;
    private String profileCreatedBy;
    private Boolean isPremium;
    private String profilePhotoUrl;
    private String photoUrl2;
    private String photoUrl3;
    private String photoUrl4;
    private String photoUrl5;
    private String photoUrl6;
    private Integer photoCount;
    private Boolean profileComplete;
    private String verificationStatus;
    private String idProofType;
    private String idProofNumber;
    private String idProofUrl;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    private Boolean enabled;
    private String photoVerificationStatus;
    private Boolean mobileVerified;
    private Double matchPercentage;
    private Boolean isOnline;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("lastActive")
    private LocalDateTime lastActive;
    private Boolean premiumVisible;
    private Boolean isContactViewed;
    private java.util.List<String> topMatchReasons;
    private PartnerPreferenceDTO partnerPreference;
}
