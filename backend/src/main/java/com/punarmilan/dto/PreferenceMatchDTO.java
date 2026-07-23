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
public class PreferenceMatchDTO {
    private int totalPreferences;
    private int matchedCount;
    private double matchPercentage;
    private List<FieldMatchStatus> matchList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FieldMatchStatus {
        private String fieldLabel;
        private String prefValue;
        private String actualValue;
        
        @com.fasterxml.jackson.annotation.JsonProperty("isMatch")
        private boolean isMatch;
    }
}
