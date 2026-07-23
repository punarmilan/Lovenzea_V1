package com.punarmilan.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginOtpRequest {
    
    @NotBlank(message = "Identifier (email or mobile) is required")
    private String identifier;
    
    @NotBlank(message = "Type (EMAIL or MOBILE) is required")
    private String type;
}
