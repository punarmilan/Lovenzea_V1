package com.punarmilan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile number must be 10 digits and start with 6-9")
    private String mobileNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "First name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "First name should only contain alphabets")
    private String firstName;

    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Last name should only contain alphabets")
    private String lastName;

    @NotBlank(message = "Profile created by is required")
    private String profileCreatedBy;

    @NotBlank(message = "Gender is required")
    private String gender;
}
