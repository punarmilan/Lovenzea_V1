package com.punarmilan.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginOtpVerifyRequest {
    
    @NotBlank(message = "Identifier (email or mobile) is required")
    private String identifier;
    
    @NotBlank(message = "OTP is required")
    private String otp;
    
    @NotBlank(message = "Type (EMAIL or MOBILE) is required")
    private String type;
}
