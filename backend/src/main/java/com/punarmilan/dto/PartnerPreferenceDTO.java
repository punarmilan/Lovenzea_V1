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
public class PartnerPreferenceDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
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
    private Boolean preferWorkingProfessional;
    private Boolean preferNri;
    private Boolean showVerifiedOnly;
    private Boolean enableAutoMatch;
    private Integer matchScoreThreshold;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}
