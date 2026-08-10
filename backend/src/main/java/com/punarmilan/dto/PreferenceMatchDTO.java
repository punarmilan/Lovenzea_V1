package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenceMatchDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private int totalPreferences;
    private int matchedCount;
    private double matchPercentage;
    private List<FieldMatchStatus> matchList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FieldMatchStatus implements Serializable {
        private static final long serialVersionUID = 1L;
        private String fieldLabel;
        private String prefValue;
        private String actualValue;
        
        @com.fasterxml.jackson.annotation.JsonProperty("isMatch")
        private boolean isMatch;
    }
}
