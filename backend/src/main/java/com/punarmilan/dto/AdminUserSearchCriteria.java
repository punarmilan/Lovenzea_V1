package com.punarmilan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserSearchCriteria {
    private String email;
    private String mobileNumber;
    private String gender;
    private String city;
    private String religion;
    private Boolean enabled;
}
