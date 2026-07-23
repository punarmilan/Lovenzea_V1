package com.punarmilan.dto;

import com.punarmilan.entity.enums.AdminRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminResponse {
    private Long id;
    private String name;
    private String email;
    private AdminRole role;
    private String token;
}
