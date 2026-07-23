package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchCriteriaDTO {
    private String profileId;
    private Integer ageFrom;
    private Integer ageTo;
    private String heightFrom;
    private String heightTo;
    private List<String> maritalStatus;
    private List<String> religion;
    private List<String> motherTongue;
    private List<String> caste;
    private List<String> country;
    private List<String> state;
    private String gender; // The target gender to search for

    // Advanced search fields
    private List<String> residencyStatus;
    private List<String> grewUpIn;
    private List<String> educationLevel;
    private List<String> educationField;
    private List<String> workingWith;
    private List<String> occupation;
    private String minIncome;
    private String maxIncome;
    private List<String> diet;
    private List<String> profileCreatedBy;
    private Boolean isPremium;
    private Boolean chatStatus;
    private Boolean showWithPhoto;
    private Boolean showProtectedPhoto;

    // Premium Filtering Fields
    private String keyword; // For Name, Profile ID, City, Occupation search
    private List<String> subCaste;
    private List<String> city;
    private List<String> workingCity;
    private List<String> company;
    private String weight;
    private List<String> bloodGroup;
    private String disability;
    private List<String> smokingHabit;
    private List<String> drinkingHabit;
    private List<String> familyFinancialStatus;
    private String fatherStatus;
    private String motherStatus;
    private Integer brothersCount;
    private Integer sistersCount;
    private String manglikStatus;
    private List<String> rashi;
    private List<String> nakshatra;
    private List<String> gotra;
    
    // Status Toggles
    private Boolean verified;
    private Boolean premium;
    private Boolean profileComplete;
    private Boolean photoAvailable;
    private Boolean onlineNow;
    
    // Sorting
    private String sort;
}
